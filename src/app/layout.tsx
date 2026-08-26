import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Trip Talk", description: "旅先で使う英会話練習" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f5f1e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
