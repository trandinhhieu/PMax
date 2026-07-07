import type { LocalizedText } from "@/types/common";

export type MenuCategory = "pizza" | "pasta" | "salad-burger" | "mexican" | "drinks";

export type MenuPriceKey = "small" | "medium" | "fivePcs" | "eightPcs" | "glass" | "pot";

export type MenuItemKind = "dish" | "addon" | "drink";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  groupId: string;
  name: string;
  serving?: string;
  description?: string;
  descriptionVi?: string;
  price?: number;
  prices?: Partial<Record<MenuPriceKey, number>>;
  recommended?: boolean;
  tags?: LocalizedText[];
  note?: string;
  noteVi?: string;
  kind?: MenuItemKind;
  displayOrder: number;
};

export type MenuItemImage = {
  src: string;
  alt: LocalizedText;
  isPlaceholder?: boolean;
};

export type MenuCategoryMeta = {
  id: MenuCategory;
  label: LocalizedText;
  description: LocalizedText;
};

export type MenuGroup = {
  id: string;
  category: MenuCategory;
  title: LocalizedText;
  note?: LocalizedText;
  layout?: "cards" | "compact";
  displayOrder: number;
};
