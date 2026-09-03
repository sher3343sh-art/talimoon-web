import { redirect } from "next/navigation";

/**
 * Canonical `/begin/personalized-book` — no UI of its own. The order
 * journey always shows the price before the form, so this route just
 * redirects to the pricing step.
 *
 *   /begin/personalized-book        -> /begin/personalized-book/price
 *   /begin/personalized-book/price  -> Personalized Book pricing (PricingSection)
 *   /begin/personalized-book/form   -> the existing order form
 */
export default function PersonalizedBookIndex() {
  redirect("/begin/personalized-book/price");
}
