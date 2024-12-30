import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const graphik = localFont({
  src: [
    {
      path: '../public/fonts/Graphik-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Graphik-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Graphik-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Graphik-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-graphik',
});

export const metadata: Metadata = {
  title: "Calculadora de Preços",
  description: "Ferramenta de cálculo de preços e markup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${graphik.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

