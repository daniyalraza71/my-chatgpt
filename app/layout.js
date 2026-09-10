import "./globals.css";

export const metadata = {
  title: "My AI",
  description: "Personal ChatGPT-style AI assistant"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}