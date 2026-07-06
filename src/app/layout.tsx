import type { Metadata } from "next";
import "./globals.css";

const deploymentUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

export const metadata: Metadata = {
  metadataBase: deploymentUrl ? new URL(deploymentUrl) : undefined,
  title: {
    default: "Hermanos Wood-fired Pizza Da Nang",
    template: "%s | Hermanos Wood-fired Pizza",
  },
  description: "Wood-fired pizza, tacos, pasta, burgers and drinks near My Khe Beach in Da Nang.",
  openGraph: deploymentUrl ? { images: [`${deploymentUrl}/images/food/hero-pizza-tacos.jpeg`] } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
