import type { Metadata } from "next";
import { Underdog } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

const underdog = Underdog({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "GuessThatDoodle",
  description:
    "Jump into fast-paced, real-time drawing battles with friends or strangers! Scribble, guess the doodle, and connect face-to-face with built-in video chat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={underdog.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
