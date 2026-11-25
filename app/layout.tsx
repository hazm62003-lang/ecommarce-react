import type { Metadata } from "next";
import { Exo, Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const exo = Exo({ subsets: ["latin"], variable: "--font-exo", weight: ["400", "500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "FreshCart - Your one-stop shop", template: "%s | FreshCart" },
  description: "Quality products from fashion to electronics at competitive prices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${exo.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
