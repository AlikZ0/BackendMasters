"use client";

import { create } from "zustand";
import { readCookie, writeCookie, deleteCookie } from "@/lib/cookies";

const COOKIE_NAME = "bm_profile";

interface ProfileData {
  name: string;
  joinedAt: string;
}

interface ProfileState {
  profile: ProfileData | null;
  hydrated: boolean;
  hydrate: () => void;
  setName: (name: string) => void;
  reset: () => void;
}

function readProfile(): ProfileData | null {
  const raw = readCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ProfileData;
    if (typeof parsed.name === "string" && typeof parsed.joinedAt === "string") {
      return parsed;
    }
  } catch {
    /* fall through */
  }
  return null;
}

function persist(profile: ProfileData): void {
  writeCookie(COOKIE_NAME, JSON.stringify(profile));
}

export const useProfile = create<ProfileState>((set) => ({
  profile: null,
  hydrated: false,
  hydrate: () => set({ profile: readProfile(), hydrated: true }),
  setName: (name) => {
    const trimmed = name.trim().slice(0, 32);
    if (!trimmed) return;
    const next: ProfileData = {
      name: trimmed,
      joinedAt: readProfile()?.joinedAt ?? new Date().toISOString(),
    };
    persist(next);
    set({ profile: next });
  },
  reset: () => {
    deleteCookie(COOKIE_NAME);
    set({ profile: null });
  },
}));
