import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { LenisProvider } from "@/Providers/LenisProvider";
import { MouseProvider } from "@/Providers/MouseProvider";

export const metadata: Metadata = {
  title: "Chris Hall",
  description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <MouseProvider>
            {children}
          </MouseProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
