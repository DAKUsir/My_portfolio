import type { Metadata, Viewport } from "next";
import { MotionProvider, ScrollProgress } from "./components/motion";
import { NeuralNetworkBackground } from "./components/neural-network-background";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditya Chauhan | AI/ML Engineering & Full-Stack Development",
  description:
    "Aditya Chauhan is an AI/ML and full-stack developer building useful, AI-enabled products. Explore selected projects, skills, and ways to connect.",
  keywords: [
    "Aditya Chauhan",
    "AI engineer",
    "machine learning",
    "full-stack developer",
    "portfolio",
  ],
  openGraph: {
    title: "Aditya Chauhan | AI/ML Engineering & Full-Stack Development",
    description:
      "AI-enabled applications, machine learning projects, and thoughtful software engineering.",
    type: "website",
    locale: "en_IN",
    siteName: "Aditya Chauhan",
  },
  applicationName: "Aditya Chauhan Portfolio",
  authors: [{ name: "Aditya Chauhan" }],
  creator: "Aditya Chauhan",
  robots: { index: true, follow: true },
  twitter: {
    card: "summary",
    title: "Aditya Chauhan | AI/ML Engineering & Full-Stack Development",
    description:
      "AI-enabled applications, machine learning projects, and thoughtful software engineering.",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f3f1eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <NeuralNetworkBackground />
        <MotionProvider>
          <ScrollProgress />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
