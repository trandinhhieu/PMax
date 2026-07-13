import Script from "next/script.js";
import { normalizeGtmId } from "@/config/public-env-validation.mjs";

type GoogleTagManagerProps = {
  gtmId?: string;
};

export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  const normalizedGtmId = normalizeGtmId(gtmId);
  if (!normalizedGtmId) return null;

  return (
    <>
      <Script
        id="gtm-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':` +
            `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],` +
            `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=` +
            `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
            `})(window,document,'script','dataLayer','${normalizedGtmId}');`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${normalizedGtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
