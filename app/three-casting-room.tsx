"use client";

import { useEffect, useRef } from "react";
import type { Group, MeshBasicMaterial, ShaderMaterial, Texture } from "three";

type ContactFrame = {
  base: { x: number; y: number; z: number; ry: number };
  frame: Group;
  image: ShaderMaterial;
  backing: MeshBasicMaterial;
};

const imageSources = [
  "/nocturne-film-still-v3.png",
  "/talent-noah-v3.png",
  "/talent-soyeon-v3.png",
  "/talent-mira-v3.png",
  "/soft-focus-beauty-v1.png",
  "/motion-study-v1.png",
];

const vertexShader = `
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float envelope = sin(uv.y * 3.14159265);
    p.z += sin(uv.y * 9.0 + uTime * 1.6) * 0.035 * envelope * uVelocity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uReveal;
  uniform float uVelocity;
  uniform float uTextureAspect;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    const float planeAspect = 0.8;
    if (uTextureAspect > planeAspect) {
      uv.x = (uv.x - 0.5) * (planeAspect / uTextureAspect) + 0.5;
    } else {
      uv.y = (uv.y - 0.5) * (uTextureAspect / planeAspect) + 0.5;
    }
    return uv;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    float slit = sin(vUv.y * 52.0 + uTime * 1.8) * 0.0028 * uVelocity;
    vec4 base = texture2D(uMap, uv);
    float red = texture2D(uMap, uv + vec2(slit, 0.0)).r;
    float blue = texture2D(uMap, uv - vec2(slit, 0.0)).b;
    vec3 split = vec3(red, base.g, blue);
    float mono = dot(split, vec3(0.299, 0.587, 0.114));
    vec3 colour = mix(vec3(mono), split, 0.62);
    float scan = 0.94 + 0.06 * sin(vUv.y * 420.0 + uTime * 4.0);
    float wipe = smoothstep(-0.05, 0.08, uReveal - (1.0 - vUv.y));
    float gate = smoothstep(0.0, 0.025, vUv.x) * smoothstep(0.0, 0.025, 1.0 - vUv.x)
      * smoothstep(0.0, 0.02, vUv.y) * smoothstep(0.0, 0.02, 1.0 - vUv.y);
    gl_FragColor = vec4(colour * scan, base.a * wipe * gate);
  }
`;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const amount = clamp((value - edge0) / (edge1 - edge0));
  return amount * amount * (3 - 2 * amount);
};

export default function ThreeCastingRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || reduceMotion) return;

    let cancelled = false;
    let teardown = () => {};

    void (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      const hero = canvas.closest<HTMLElement>(".hero");
      if (!hero) return;

      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const contextAttributes: WebGLContextAttributes = { alpha: true, antialias: !mobile, powerPreference: "high-performance" };
      const renderingContext = canvas.getContext("webgl2", contextAttributes) ?? canvas.getContext("webgl", contextAttributes);
      if (!renderingContext || renderingContext.isContextLost() || !renderingContext.getContextAttributes()) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, context: renderingContext, alpha: true, antialias: !mobile, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x09090b, mobile ? 0.055 : 0.042);
      const camera = new THREE.PerspectiveCamera(mobile ? 48 : 42, 1, 0.1, 80);
      const world = new THREE.Group();
      scene.add(world);

      const textureLoader = new THREE.TextureLoader();
      const sourceCount = mobile ? 4 : imageSources.length;
      const textures = await Promise.all(imageSources.slice(0, sourceCount).map(async source => {
        try {
          const texture = await textureLoader.loadAsync(source);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          return texture;
        } catch {
          const data = new Uint8Array([18, 18, 22, 255]);
          const texture = new THREE.DataTexture(data, 1, 1);
          texture.needsUpdate = true;
          return texture;
        }
      }));
      if (cancelled) {
        textures.forEach(texture => texture.dispose());
        renderer.dispose();
        return;
      }

      const basePositions = [
        { x: mobile ? -1.15 : -1.8, y: .2, z: 2.4, ry: .18 },
        { x: mobile ? 1.15 : 1.75, y: -.35, z: -1.5, ry: -.2 },
        { x: mobile ? -1.1 : -1.65, y: .5, z: -5.5, ry: .16 },
        { x: mobile ? 1.12 : 1.7, y: .35, z: -9.5, ry: -.18 },
        { x: mobile ? -1.2 : -1.82, y: -.4, z: -13.5, ry: .2 },
        { x: mobile ? 1.08 : 1.6, y: .1, z: -17.5, ry: -.16 },
      ];
      const frames: ContactFrame[] = [];
      const planeGeometry = new THREE.PlaneGeometry(2.6, 3.25, 24, 24);
      const backGeometry = new THREE.PlaneGeometry(2.76, 3.43);
      const edgeGeometry = new THREE.EdgesGeometry(backGeometry);

      textures.forEach((texture: Texture, index) => {
        const base = basePositions[index];
        const frame = new THREE.Group();
        frame.position.set(base.x, base.y, base.z);
        frame.rotation.y = base.ry;

        const textureImage = texture.image as { width?: number; height?: number } | undefined;
        const textureAspect = (textureImage?.width ?? 4) / (textureImage?.height ?? 5);
        const image = new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: texture },
            uTime: { value: 0 },
            uReveal: { value: 0 },
            uVelocity: { value: 0 },
            uTextureAspect: { value: textureAspect },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const backing = new THREE.MeshBasicMaterial({ color: 0x09090c, transparent: true, opacity: .86, side: THREE.DoubleSide });
        const backingMesh = new THREE.Mesh(backGeometry, backing);
        backingMesh.position.z = -.035;
        const imageMesh = new THREE.Mesh(planeGeometry, image);
        const border = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: index === 0 ? 0xe44832 : 0x8e8a84, transparent: true, opacity: index === 0 ? .82 : .38 }));
        border.position.z = .02;
        frame.add(backingMesh, imageMesh, border);
        world.add(frame);
        frames.push({ base, frame, image, backing });
      });

      const railMaterial = new THREE.LineBasicMaterial({ color: 0x6f6b66, transparent: true, opacity: .2 });
      const railPositions: number[] = [];
      [-4.15, 4.15].forEach(x => [-2.45, 2.45].forEach(y => railPositions.push(x, y, 6, x, y, -31)));
      const railGeometry = new THREE.BufferGeometry();
      railGeometry.setAttribute("position", new THREE.Float32BufferAttribute(railPositions, 3));
      world.add(new THREE.LineSegments(railGeometry, railMaterial));

      const dustCount = mobile ? 72 : 160;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let index = 0; index < dustCount; index += 1) {
        dustPositions[index * 3] = (Math.random() - .5) * 9;
        dustPositions[index * 3 + 1] = (Math.random() - .5) * 6;
        dustPositions[index * 3 + 2] = 7 - Math.random() * 38;
      }
      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      const dustMaterial = new THREE.PointsMaterial({ color: 0xd6d0c7, size: mobile ? .014 : .018, transparent: true, opacity: .46, depthWrite: false });
      const dust = new THREE.Points(dustGeometry, dustMaterial);
      world.add(dust);

      const scanMaterial = new THREE.MeshBasicMaterial({ color: 0xe44832, transparent: true, opacity: .48, blending: THREE.AdditiveBlending, depthWrite: false });
      const scanner = new THREE.Mesh(new THREE.PlaneGeometry(.018, 5.4), scanMaterial);
      scene.add(scanner);

      const pointer = { x: 0, y: 0 };
      let currentProgress = 0;
      let previousProgress = 0;
      let velocity = 0;
      let frameId = 0;
      let active = true;
      const startTime = performance.now();

      const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };
      const move = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth - .5) * 2;
        pointer.y = (event.clientY / window.innerHeight - .5) * 2;
      };

      const render = (now: number) => {
        frameId = 0;
        const heroRect = hero.getBoundingClientRect();
        const maxTravel = Math.max(hero.offsetHeight - window.innerHeight, 1);
        const targetProgress = clamp(-heroRect.top / maxTravel);
        currentProgress += (targetProgress - currentProgress) * .085;
        const delta = Math.abs(currentProgress - previousProgress);
        velocity += (Math.min(delta * 85, 1) - velocity) * .12;
        previousProgress = currentProgress;

        const cameraZ = 7.8 - currentProgress * 25.7;
        camera.position.set(pointer.x * (mobile ? .12 : .3), -pointer.y * (mobile ? .08 : .18), cameraZ);
        camera.lookAt(pointer.x * .08, -pointer.y * .05, cameraZ - 7.5);
        const assembly = smoothstep(.74, .96, currentProgress);
        const elapsed = (now - startTime) / 1000;

        frames.forEach((entry, index) => {
          const columns = mobile ? 2 : 3;
          const column = index % columns;
          const row = Math.floor(index / columns);
          const gridX = (column - (columns - 1) / 2) * (mobile ? 1.78 : 2.05);
          const gridY = mobile ? (1 - row) * 1.52 : (row === 0 ? 1 : -1) * 1.38;
          const gridZ = cameraZ - (mobile ? 6.6 : 7.2);
          entry.frame.position.set(
            THREE.MathUtils.lerp(entry.base.x, gridX, assembly),
            THREE.MathUtils.lerp(entry.base.y, gridY, assembly),
            THREE.MathUtils.lerp(entry.base.z, gridZ, assembly),
          );
          entry.frame.rotation.y = THREE.MathUtils.lerp(entry.base.ry, 0, assembly);
          entry.frame.rotation.z = THREE.MathUtils.lerp((index % 2 ? 1 : -1) * .015, 0, assembly);
          const distance = cameraZ - entry.frame.position.z;
          const proximity = clamp(1 - Math.abs(distance - 5.2) / 8.5);
          const visibility = Math.max(proximity, assembly);
          entry.frame.visible = visibility > .015;
          entry.image.uniforms.uTime.value = elapsed;
          entry.image.uniforms.uVelocity.value = velocity;
          entry.image.uniforms.uReveal.value = clamp(visibility * 1.45);
          entry.backing.opacity = .18 + visibility * .7;
          entry.frame.scale.setScalar(THREE.MathUtils.lerp(1, mobile ? .62 : .68, assembly));
        });

        scanner.position.set(Math.sin(currentProgress * Math.PI * 3) * (mobile ? 2.1 : 3.4), 0, cameraZ - 6.2);
        scanner.material.opacity = .2 + velocity * .65;
        dust.rotation.z = elapsed * .008;
        world.rotation.z = pointer.x * -.005;
        renderer.render(scene, camera);
        if (active) frameId = window.requestAnimationFrame(render);
      };

      const observer = new IntersectionObserver(([entry]) => {
        active = entry.isIntersecting;
        if (!active && frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        } else if (active && !frameId) {
          frameId = window.requestAnimationFrame(render);
        }
      }, { rootMargin: "160px" });

      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", move, { passive: true });
      observer.observe(hero);
      frameId = window.requestAnimationFrame(render);

      teardown = () => {
        active = false;
        window.cancelAnimationFrame(frameId);
        observer.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", move);
        scene.traverse(object => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
            object.geometry?.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach(material => material.dispose());
          }
        });
        textures.forEach(texture => texture.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
      };
    })();

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-three" data-webgl="casting-room" aria-hidden="true" />;
}
