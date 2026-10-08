import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cement Volume Dashboard",
  description: "Dashboard volume semen per plant dan kategori.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
