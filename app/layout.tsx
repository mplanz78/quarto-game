import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quarto",
  description: "Jogo Quarto online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5632723952125426"
          crossOrigin="anonymous"
        ></script>

      </head>

      <body>
        {children}
      </body>
    </html>
  );
}