import type { Metadata, Viewport } from "next";
import { MotionProvider } from "./components/motion";
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
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b0e13",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
