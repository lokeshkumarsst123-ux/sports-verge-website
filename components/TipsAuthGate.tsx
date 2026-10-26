"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasAuthSession } from "@/lib/auth-api";

function subscribe(onChange: () => void) {
  window.addEventListener("auth-session-changed", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("auth-session-changed", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export default function TipsAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authenticated = useSyncExternalStore(subscribe, hasAuthSession, () => false);

  useEffect(() => {
    if (!hasAuthSession()) {
      const next = window.location.pathname + window.location.search;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [authenticated, pathname, router]);

  if (!authenticated) {
    return <main className="container py-5"><p role="status">Redirecting to sign in...</p></main>;
  }

  return children;
}
