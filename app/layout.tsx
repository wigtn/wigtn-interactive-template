import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og-assembly-v2.jpg`;

  return {
    title: "ASSEMBLY — Talent Management, Seoul",
    description: "Independent talent management agency representing models and actors for film, fashion and beauty.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "ASSEMBLY — Talent Management, Seoul",
      description: "Models and actors represented for film, fashion and beauty in Seoul and worldwide.",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "ASSEMBLY — Talent Management, Seoul" }],
    },
    twitter: { card: "summary_large_image", title: "ASSEMBLY — Talent Management, Seoul", description: "Models and actors represented for film, fashion and beauty in Seoul and worldwide.", images: [image] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/nocturne-film-still-v3.png" as="image" fetchPriority="high" />
        <link rel="preload" href="/talent-noah-v3.png" as="image" />
        <link rel="preload" href="/talent-soyeon-v3.png" as="image" />
        <link rel="preload" href="/talent-mira-v3.png" as="image" />
        <link rel="preload" href="/soft-focus-beauty-v1.png" as="image" />
        <link rel="preload" href="/motion-study-v1.png" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
