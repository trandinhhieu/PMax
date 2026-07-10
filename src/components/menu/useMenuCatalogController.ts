"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { menuCategories, menuGroups, menuItems, type MenuCategory } from "@/data/menu";

const pageSize = 12;

export function useMenuCatalogController() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("pizza");
  const [activeGroupId, setActiveGroupId] = useState("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const catalogRef = useRef<HTMLElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const activeCategoryMeta = menuCategories.find((category) => category.id === activeCategory) ?? menuCategories[0];
  const activeCategoryIndex = menuCategories.findIndex((category) => category.id === activeCategory);
  const nextCategory = menuCategories[(activeCategoryIndex + 1) % menuCategories.length];
  const activeGroups = useMemo(() => menuGroups.filter((group) => group.category === activeCategory), [activeCategory]);
  const activeGroupMeta = activeGroups.find((group) => group.id === activeGroupId) ?? null;
  const categoryItems = useMemo(() => menuItems.filter((item) => item.category === activeCategory), [activeCategory]);
  const groupCountMap = useMemo(
    () =>
      activeGroups.reduce<Record<string, number>>((counts, group) => {
        counts[group.id] = categoryItems.filter((item) => item.groupId === group.id).length;
        return counts;
      }, {}),
    [activeGroups, categoryItems],
  );
  const filteredItems = useMemo(
    () => categoryItems.filter((item) => (activeGroupId === "all" ? true : item.groupId === activeGroupId)),
    [activeGroupId, categoryItems],
  );
  const displayGroups = activeGroupMeta ? [activeGroupMeta] : activeGroups;
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  useEffect(() => {
    setActiveGroupId("all");
    setVisibleCount(pageSize);
  }, [activeCategory]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeGroupId]);

  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => Math.min(current + pageSize, filteredItems.length));
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [filteredItems.length, hasMore]);

  const scrollTo = (element: HTMLElement | null) => {
    window.requestAnimationFrame(() => {
      if (!element) return;

      const top = element.getBoundingClientRect().top + window.scrollY;
      const stickyOffset = window.innerWidth >= 1024 ? 188 : 172;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        top: Math.max(top - stickyOffset, 0),
      });
    });
  };

  const chooseCategory = (category: MenuCategory) => {
    setActiveCategory(category);
    scrollTo(catalogRef.current);
  };

  const chooseGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    scrollTo(itemsRef.current);
  };

  const resetGroup = () => {
    setActiveGroupId("all");
    scrollTo(itemsRef.current);
  };

  const loadMore = () => {
    setVisibleCount((current) => Math.min(current + pageSize, filteredItems.length));
  };

  return {
    activeCategory,
    activeCategoryMeta,
    activeGroupMeta,
    activeGroups,
    activeGroupId,
    catalogRef,
    chooseCategory,
    chooseGroup,
    displayGroups,
    filteredItems,
    groupCountMap,
    hasMore,
    loadMore,
    nextCategory,
    resetGroup,
    scrollToCatalog: () => scrollTo(catalogRef.current),
    itemsRef,
    sentinelRef,
    visibleCount,
    visibleItems,
    visibleTotalCount: categoryItems.length,
  };
}
