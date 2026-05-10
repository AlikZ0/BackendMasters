"use client";

import { useEffect } from "react";
import { useProfile } from "@/store/profile";

export function ProfileBootstrap() {
  const hydrate = useProfile((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
