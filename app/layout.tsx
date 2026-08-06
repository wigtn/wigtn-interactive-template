import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og-assembly-v1.png`;

  return {
    title: "ASSEMBLY — Casting Office, Seoul",
    description: "Model and actor casting, motion tests and campaign production from an independent Seoul office.",
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
