import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-korean",
  preload: false,
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og-assembly-v1.png`;

  return {
    title: "ASSEMBLY — Casting Office, Seoul",
    description: "광고와 필름을 위한 모델·배우 캐스팅, 무빙 테스트와 일정 관리를 한 번에 제공하는 서울 캐스팅 오피스.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "ASSEMBLY — Casting Office, Seoul",
      description: "Model and actor casting for film and campaign production in Seoul.",
      type: "website",
      images: [{ url: image, width: 1536, height: 1024, alt: "ASSEMBLY — Casting Office, Seoul" }],
    },
    twitter: { card: "summary_large_image", title: "ASSEMBLY — Casting Office, Seoul", description: "Model and actor casting for film and campaign production in Seoul.", images: [image] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" href="/talent-noah-v2.jpg" as="image" />
        <link rel="preload" href="/cast-hero-v2.jpg" as="image" />
        <link rel="preload" href="/editorial-backstage-v2.jpg" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
