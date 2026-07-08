"use client";

import { useEffect, useState } from "react";
import { switchLocalePath } from "@/lib/locale-routing";
import type { Locale } from "@/types/common";

type UseHeaderLocationOptions = {
  pathname: string;
  homePath: string;
  nextLocale: Locale;
};

export function useHeaderLocation({ pathname, homePath, nextLocale }: UseHeaderLocationOptions) {
  const [locationSuffix, setLocationSuffix] = useState("");
  const [activeHref, setActiveHref] = useState(`${homePath}/menu`);

  useEffect(() => {
    const updateLocationState = () => {
      setLocationSuffix(`${window.location.search}${window.location.hash}`);
      setActiveHref(window.location.pathname.endsWith("/menu") ? window.location.pathname : `${window.location.pathname}${window.location.hash}`);
    };

    updateLocationState();
    window.addEventListener("hashchange", updateLocationState);

    return () => window.removeEventListener("hashchange", updateLocationState);
  }, [pathname]);

  return {
    activeHref,
    nextLocalePath: `${switchLocalePath(pathname, nextLocale)}${locationSuffix}`,
    setActiveHref,
  };
}
