import type { Metadata } from "next";
import { businessInfo } from "@/config/business";
import { getDeploymentUrl } from "@/lib/site-url";
import "./globals.css";

const deploymentUrl = getDeploymentUrl();

export const metadata: Metadata = {
  metadataBase: deploymentUrl ? new URL(deploymentUrl) : undefined,
  title: {
    default: "Hermanos Wood-fired Pizza Da Nang",
    template: "%s | Hermanos Wood-fired Pizza",
  },
  description: "Wood-fired pizza, tacos, pasta, burgers and drinks near My Khe Beach in Da Nang.",
  icons: {
    icon: businessInfo.assets.logo,
    apple: businessInfo.assets.logo,
  },
  openGraph: deploymentUrl ? { images: [`${deploymentUrl}/images/food/hero-pizza-tacos.jpeg`] } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
