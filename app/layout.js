import "./globals.css";  // <--- Ye line styling load karti hai

export const metadata = {
  title: 'Mangla Portfolio',
  description: 'AI/ML & Full Stack Developer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}