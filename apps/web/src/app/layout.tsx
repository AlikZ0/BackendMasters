import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileTabs } from "@/components/MobileTabs";
import { ProfileBootstrap } from "@/components/ProfileBootstrap";

export const metadata: Metadata = {
  title: {
    default: "BackendMasters — От нуля до Senior Backend",
    template: "%s · BackendMasters",
  },
  description:
    "Интерактивный самоучитель backend-инженерии: Node.js, базы данных, Docker, system design. Прогресс хранится локально, работает офлайн.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "BackendMasters",
    description:
      "Стань Senior Backend Engineer со знаниями Docker — без подписок и регистрации.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070a13",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased pb-24 md:pb-0 min-h-screen">
        <ProfileBootstrap />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-20">
          {children}
        </main>
        <MobileTabs />
      </body>
    </html>
  );
}
