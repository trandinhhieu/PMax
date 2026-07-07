import type { Locale } from "@/types/common";
import type { MenuCategoryMeta, MenuItem, MenuItemImage } from "@/data/menu.types";
import { menuGroups, menuItems } from "@/data/menu.generated";
export type { MenuCategory, MenuCategoryMeta, MenuGroup, MenuItem, MenuItemImage, MenuItemKind, MenuPriceKey } from "@/data/menu.types";
export { menuGroups, menuItems };

export const menuCategories: MenuCategoryMeta[] = [
  {
    id: "pizza",
    label: { en: "Pizza", vi: "Pizza" },
    description: {
      en: "Wood-fired classics, specialty pies and extra toppings.",
      vi: "Pizza nướng củi cổ điển, món đặc biệt và topping gọi thêm.",
    },
  },
  {
    id: "pasta",
    label: { en: "Pasta", vi: "Pasta" },
    description: {
      en: "Comforting pasta with creamy, tomato, seafood and truffle options.",
      vi: "Pasta ấm bụng với sốt kem, cà chua, hải sản và truffle.",
    },
  },
  {
    id: "salad-burger",
    label: { en: "Salad & Burger", vi: "Salad & Burger" },
    description: {
      en: "Fresh salads, burgers, fries, wedges and wings.",
      vi: "Salad tươi, burger, khoai tây chiên, wedges và cánh gà.",
    },
  },
  {
    id: "mexican",
    label: { en: "Mexican", vi: "Món Mexico" },
    description: {
      en: "Nachos, tacos, quesadillas and wraps for the table.",
      vi: "Nachos, tacos, quesadilla và wrap để chia sẻ.",
    },
  },
  {
    id: "drinks",
    label: { en: "Drinks", vi: "Đồ uống" },
    description: {
      en: "Craft beer, wine, soft drinks, tea, soda and fresh juice.",
      vi: "Bia thủ công, rượu vang, nước ngọt, trà, soda và nước ép.",
    },
  },
];

const signatureMenuItemIds = ["pepperoni-pizza", "grilled-chicken-tacos", "cheese-burger"];

export const signatureMenuItems: MenuItem[] = signatureMenuItemIds.flatMap((id) => {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  return item ? [item] : [];
});

export function formatMenuPrice(price: number, showPlus = false) {
  return `${showPlus ? "+" : ""}${price}K`;
}

export function getMenuItemDescription(item: MenuItem, locale: Locale) {
  if (locale === "vi" && item.descriptionVi) return item.descriptionVi;
  return item.description;
}

export function getMenuItemNote(item: MenuItem, locale: Locale) {
  if (locale === "vi" && item.noteVi) return item.noteVi;
  return item.note;
}

export function getMenuPreviewItems(category: MenuCategoryMeta["id"]) {
  const eligibleItems = menuItems.filter((item) => item.category === category && item.kind !== "addon");
  const highlightedItems = eligibleItems.filter((item) => item.recommended);

  return (highlightedItems.length ? highlightedItems : eligibleItems).slice(0, 4);
}

export function getMenuItemImage(item: MenuItem): MenuItemImage {
  if (item.kind !== "addon" && item.category === "pizza") {
    return {
      src: "/images/menu/pizza.webp",
      alt: { en: `${item.name} pizza at Hermanos`, vi: `Pizza ${item.name} tại Hermanos` },
    };
  }

  if (item.kind !== "addon" && item.category === "pasta") {
    return {
      src: "/images/menu/pasta.avif",
      alt: { en: `${item.name} pasta at Hermanos`, vi: `Pasta ${item.name} tại Hermanos` },
    };
  }

  if (item.kind !== "addon" && item.groupId === "burger") {
    return {
      src: "/images/menu/cheese-burger.avif",
      alt: { en: `${item.name} at Hermanos`, vi: `${item.name} tại Hermanos` },
    };
  }

  if (item.kind !== "addon" && item.category === "mexican") {
    return {
      src: "/images/food/tacos.jpeg",
      alt: { en: `${item.name} Mexican plate at Hermanos`, vi: `${item.name} tại Hermanos` },
    };
  }

  if (item.kind !== "addon" && item.category === "salad-burger") {
    return {
      src: "/images/food/burger.jpeg",
      alt: { en: `${item.name} at Hermanos`, vi: `${item.name} tại Hermanos` },
    };
  }

  return {
    src: "/images/menu/no-image-available.jpg",
    alt: { en: `No image available for ${item.name}`, vi: `Chưa có ảnh cho ${item.name}` },
    isPlaceholder: true,
  };
}
