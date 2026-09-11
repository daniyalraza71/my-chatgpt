import "./globals.css";

export const metadata = {
  title: "My AI",
  description: "Personal ChatGPT-style AI assistant",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "contain", // Status bar ke niche push karne ke liye contain rakha hai
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}