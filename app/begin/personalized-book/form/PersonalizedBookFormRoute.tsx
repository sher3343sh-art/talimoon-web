"use client";

import { useRouter } from "next/navigation";
import PersonalizedBookOrderForm from "@/components/begin/PersonalizedBookOrderForm";

/**
 * Thin client wrapper so the route can hand the EXISTING
 * `PersonalizedBookOrderForm` an `onBack` handler. "Back" from the
 * form's first screen returns to the previous journey step — the
 * pricing route — not to `/begin`.
 *
 * No props are passed in: package (single/multi) is chosen inside the
 * form's own Phase 01, and the market is preserved by the existing
 * `useMarketPreference` mechanism the form already reads — this task
 * deliberately introduces no new selection-transfer state.
 */
export default function PersonalizedBookFormRoute() {
  const router = useRouter();
  return (
    <PersonalizedBookOrderForm
      onBack={() => router.push("/begin/personalized-book/price")}
    />
  );
}
