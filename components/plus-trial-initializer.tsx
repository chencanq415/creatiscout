"use client";

import { getOrCreatePlusTrial } from "@/lib/account/trial";
import { useEffect } from "react";

export function PlusTrialInitializer() {
  useEffect(() => {
    getOrCreatePlusTrial();
  }, []);
  return null;
}
