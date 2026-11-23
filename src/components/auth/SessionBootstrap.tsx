"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout as clearUser, setSession } from "@/feature/user/userSlice";
import { authClient } from "@/lib/auth/client";
import { SessionExpiredModal } from "./SessionExpiredModal";

/** Names the old client-side auth used. Removed on load so no token lingers where scripts can read it. */
const LEGACY_COOKIES = ["accessToken", "refreshToken", "adminAuthorized"];
const LEGACY_STORAGE = ["persist:root", "pp_captured_leads"];

function removeLegacyAuth() {
  try {
    for (const key of LEGACY_STORAGE) window.localStorage.removeItem(key);
  } catch {
    // storage blocked: nothing to clean
  }
  for (const name of LEGACY_COOKIES) document.cookie = `${name}=; Max-Age=0; path=/`;
}

/** Loads who is signed in from the server once, and shows the session-expired dialog when the API says so. */
export function SessionBootstrap() {
  const dispatch = useAppDispatch();
  const expired = useAppSelector((state) => state.user.expired);
  const router = useRouter();

  useEffect(() => {
    removeLegacyAuth();
    let cancelled = false;
    authClient
      .session()
      .then((user) => !cancelled && dispatch(setSession(user)))
      .catch(() => !cancelled && dispatch(setSession(null)));
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <SessionExpiredModal
      isOpen={expired}
      onClose={() => {
        dispatch(clearUser());
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }}
    />
  );
}

/** Signs out on the server (ends the API session, clears cookies) and returns to the login page. */
export function useLogout() {
  const dispatch = useAppDispatch();
  return async () => {
    await authClient.logout().catch(() => undefined);
    dispatch(clearUser());
    // Full navigation on purpose: no signed-in page state or cached API data survives in memory.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional hard reload on sign-out
    window.location.assign("/login");
  };
}
