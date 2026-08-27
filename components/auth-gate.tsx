"use client";

import { useAuthHydrated, useAuthStore } from "@/lib/account/auth-store";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    if (hydrated && !currentUser) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [currentUser, hydrated, pathname, router]);

  if (!hydrated || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate">
          <LoaderCircle className="h-4 w-4 animate-spin text-brand" />
          CreatiScout
        </div>
      </div>
    );
  }

  return children;
}
