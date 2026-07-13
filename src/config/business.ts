import { getDeploymentUrl } from "@/lib/site-url";
import type { LocalizedText } from "@/types/common";

const deploymentUrl = getDeploymentUrl();

export const businessInfo = {
  name: "Hermanos Wood-fired Pizza",
  displayName: "Hermanos Wood-fired Pizza Da Nang",
  address: {
    en: "169 To Hien Thanh, Phuoc My, Son Tra, Da Nang, Vietnam",
    vi: "169 Tô Hiến Thành, Phước Mỹ, Sơn Trà, Đà Nẵng, Việt Nam",
  } satisfies LocalizedText,
  addressStructured: {
    streetAddress: "169 To Hien Thanh",
    addressLocality: "Da Nang",
    addressRegion: "Da Nang",
    addressCountry: "VN",
  },
  phone: "+84905906842",
  displayPhone: "+84 905 906 842",
  openingHours: {
    en: "Open daily: 4:00 PM - 11:00 PM",
    vi: "Mở cửa hằng ngày: 16:00 - 23:00",
  } satisfies LocalizedText,
  openingHoursStructured: {
    opens: "16:00",
    closes: "23:00",
  },
  timeZone: "Asia/Ho_Chi_Minh",
  googleMapsUrl: "https://maps.app.goo.gl/xHLMf8XpVJvTmfmp9",
  priceRange: "$$",
  menuUrl: "/menu",
  coordinates: {
    latitude: 16.0566711,
    longitude: 108.2442548,
  },
  assets: {
    logo: "/images/brand/hermanos-logo.jpg",
    hero: "/images/hero/hero_img.jpg",
    ogImage: "/images/food/hero-pizza-tacos.jpeg",
  },
  socials: {
    facebook: "https://www.facebook.com/hermanosdanang/",
    instagram: "https://www.instagram.com/hermanospizzadanang/",
    tripadvisor:
      "https://www.tripadvisor.com/Restaurant_Review-g298085-d20300702-Reviews-Hermanos_Wood_fired_Pizza-Da_Nang.html",
    tiktok: "https://www.tiktok.com/@pizzalocui.danang",
    zalo: "https://zalo.me/84905906842",
    whatsapp: "https://wa.me/84905906842",
  },
  cuisine: [
    "Wood-fired pizza",
    "Pizza",
    "Tacos",
    "Pasta",
    "Burgers",
    "Wings",
    "Salads",
    "Drinks",
  ],
};

export const siteConfig = {
  domain: deploymentUrl,
  defaultLocale: "en",
  routeBase: "",
};
