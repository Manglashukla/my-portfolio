import "./globals.css";
import { Cinzel, Playfair_Display, Inter } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Mangla Shukla | Portfolio',
  description: 'AI/ML & Full Stack Developer - Royal Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}