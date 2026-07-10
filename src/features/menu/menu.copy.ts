import type { Locale } from "@/types/common";

type MenuCopy = {
  badge: {
    noPhoto: string;
    recommended: string;
  };
  counts: {
    categories: (count: number) => string;
    groups: (count: number) => string;
    items: (visible: number, total: number) => string;
    totalItems: (count: number) => string;
  };
  empty: {
    body: string;
    title: string;
  };
  endState: {
    body: string;
    title: string;
  };
  filter: {
    all: string;
  };
  nav: {
    categories: string;
    currentCategory: string;
    groups: string;
  };
  page: {
    body: string;
    eyebrow: string;
    highlights: Array<{
      description: string;
      title: string;
    }>;
    pricingLabel: string;
    pricingValue: string;
    title: string;
  };
  results: {
    allGroups: string;
    allItems: string;
    backToTop: string;
    loadMore: string;
    showAllGroups: string;
    showingNow: string;
    viewNextCategory: (label: string) => string;
  };
  sidebar: {
    categoriesLabel: string;
    description: string;
    jumpBetweenGroups: string;
    priceRange: (minimum: number, maximum: number) => string;
    priceRangeLabel: string;
    priceUnavailable: string;
    pricingLabel: string;
    pricingValue: string;
    title: string;
  };
};

const menuCopy = {
  en: {
    badge: {
      noPhoto: "No photo yet",
      recommended: "Recommended",
    },
    counts: {
      categories: (count) => `${count} categories`,
      groups: (count) => `${count} groups`,
      items: (visible, total) => `${visible} of ${total} items`,
      totalItems: (count) => `${count} dishes`,
    },
    empty: {
      body: "Choose another group or return to all dishes in this category.",
      title: "No dishes are listed in this group right now.",
    },
    endState: {
      body: "Jump to the next category or return to the top controls when you're ready.",
      title: "You've reached the end of this category.",
    },
    filter: {
      all: "All",
    },
    nav: {
      categories: "Menu categories",
      currentCategory: "Current category",
      groups: "Menu groups",
    },
    page: {
      body: "Browse wood-fired pizza, pasta, salads, burgers, Mexican plates, beer, wine, and fresh drinks.",
      eyebrow: "Full menu",
      highlights: [
        { description: "Pizza and familiar favorites shaped by the heat of the oven.", title: "Wood-fired focus" },
        { description: "Move from pizza and pasta to Mexican plates, burgers, salads, and drinks.", title: "Plenty to explore" },
        { description: "Every menu price is displayed in thousand VND for quick scanning.", title: "Clear pricing" },
      ],
      pricingLabel: "Pricing",
      pricingValue: "Shown in thousand VND",
      title: "Hermanos menu",
    },
    results: {
      allGroups: "All groups",
      allItems: "All dishes",
      backToTop: "Back to top",
      loadMore: "Load more",
      showAllGroups: "Show all groups",
      showingNow: "Now showing",
      viewNextCategory: (label) => `Explore ${label}`,
    },
    sidebar: {
      categoriesLabel: "Categories",
      description: "Wood-fired pizza anchors the menu, with familiar plates and drinks ready to explore by group.",
      jumpBetweenGroups: "Jump between groups",
      priceRange: (minimum, maximum) => `${minimum}K–${maximum}K`,
      priceRangeLabel: "Price range",
      priceUnavailable: "See menu prices",
      pricingLabel: "Price format",
      pricingValue: "Thousand VND",
      title: "In this category",
    },
  },
  vi: {
    badge: {
      noPhoto: "Chưa có ảnh",
      recommended: "Đề xuất",
    },
    counts: {
      categories: (count) => `${count} danh mục`,
      groups: (count) => `${count} nhóm`,
      items: (visible, total) => `${visible} / ${total} món`,
      totalItems: (count) => `${count} món`,
    },
    empty: {
      body: "Hãy chọn nhóm khác hoặc quay lại toàn bộ món trong danh mục này.",
      title: "Nhóm món này hiện chưa có món hiển thị.",
    },
    endState: {
      body: "Bạn có thể chuyển sang danh mục tiếp theo hoặc quay lại phần điều hướng phía trên.",
      title: "Bạn đã xem hết danh mục này.",
    },
    filter: {
      all: "Tất cả",
    },
    nav: {
      categories: "Danh mục menu",
      currentCategory: "Danh mục hiện tại",
      groups: "Nhóm món",
    },
    page: {
      body: "Xem pizza nướng củi, pasta, salad, burger, món Mexico, bia, rượu vang và đồ uống tươi.",
      eyebrow: "Menu đầy đủ",
      highlights: [
        { description: "Pizza và những món quen thuộc được tạo nên từ sức nóng của lò nướng.", title: "Điểm nhấn nướng củi" },
        { description: "Khám phá từ pizza, pasta đến món Mexico, burger, salad và đồ uống.", title: "Nhiều lựa chọn" },
        { description: "Mọi mức giá trong menu đều hiển thị theo nghìn VND để dễ theo dõi.", title: "Giá rõ ràng" },
      ],
      pricingLabel: "Giá",
      pricingValue: "Hiển thị theo nghìn VND",
      title: "Menu Hermanos",
    },
    results: {
      allGroups: "Tất cả nhóm",
      allItems: "Tất cả món",
      backToTop: "Lên đầu menu",
      loadMore: "Xem thêm",
      showAllGroups: "Xem tất cả nhóm",
      showingNow: "Đang hiển thị",
      viewNextCategory: (label) => `Xem ${label}`,
    },
    sidebar: {
      categoriesLabel: "Danh mục",
      description: "Pizza nướng củi là điểm nhấn của menu, cùng các món quen thuộc và đồ uống để khám phá theo từng nhóm.",
      jumpBetweenGroups: "Chuyển nhanh theo nhóm",
      priceRange: (minimum, maximum) => `${minimum}K–${maximum}K`,
      priceRangeLabel: "Khoảng giá",
      priceUnavailable: "Xem giá trong menu",
      pricingLabel: "Cách hiển thị",
      pricingValue: "Nghìn VND",
      title: "Trong danh mục này",
    },
  },
} satisfies Record<Locale, MenuCopy>;

export function getMenuCopy(locale: Locale) {
  return menuCopy[locale];
}