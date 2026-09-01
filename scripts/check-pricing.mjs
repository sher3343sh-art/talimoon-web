/**
 * Deterministic pricing check — no test framework, just `node`.
 *
 *   node scripts/check-pricing.mjs
 *
 * This mirrors the numbers and the arithmetic of
 * `components/begin/orderFormData.ts` (`MARKET_PRICING` +
 * `calculateOrderTotal`). If you change a price or the delivery rule
 * there, change it here too — the expected totals below are the
 * approved spec test matrix (spec §27–28) and must stay exact.
 */

const MARKET_PRICING = {
  UZ: { currency: "UZS", single: 499_000, multi: 699_000, extraCopy: 300_000, delivery: { fee: 40_000 } },
  INTERNATIONAL: { currency: "USD", single: 49, multi: 69, extraCopy: 30, delivery: { fee: 15 } },
};

function grandTotal({ market = "UZ", bookType, copies, deliveryRequired, regionCode }) {
  const p = MARKET_PRICING[market];
  const book = p[bookType];
  const extra = Math.max(0, copies - 1) * p.extraCopy;
  let delivery = 0;
  if (deliveryRequired) {
    delivery = market === "UZ" ? (regionCode === "tashkent_city" ? 0 : p.delivery.fee) : p.delivery.fee;
  }
  return book + extra + delivery;
}

const CASES = [
  // ── Uzbekistan (spec §27) ──────────────────────────────────────────
  ["UZ · single · pickup", { market: "UZ", bookType: "single", copies: 1, deliveryRequired: false }, 499_000],
  ["UZ · single · Tashkent city", { market: "UZ", bookType: "single", copies: 1, deliveryRequired: true, regionCode: "tashkent_city" }, 499_000],
  ["UZ · single · regional", { market: "UZ", bookType: "single", copies: 1, deliveryRequired: true, regionCode: "samarkand" }, 539_000],
  ["UZ · multi · regional", { market: "UZ", bookType: "multi", copies: 1, deliveryRequired: true, regionCode: "samarkand" }, 739_000],
  ["UZ · single + 1 extra copy · regional", { market: "UZ", bookType: "single", copies: 2, deliveryRequired: true, regionCode: "samarkand" }, 839_000],
  // ── International (spec §28) ───────────────────────────────────────
  ["INTL · single · no delivery", { market: "INTERNATIONAL", bookType: "single", copies: 1, deliveryRequired: false }, 49],
  ["INTL · single · delivery", { market: "INTERNATIONAL", bookType: "single", copies: 1, deliveryRequired: true }, 64],
  ["INTL · multi · delivery", { market: "INTERNATIONAL", bookType: "multi", copies: 1, deliveryRequired: true }, 84],
  ["INTL · single + 1 extra copy · delivery", { market: "INTERNATIONAL", bookType: "single", copies: 2, deliveryRequired: true }, 94],
  ["INTL · multi + 1 extra copy · delivery", { market: "INTERNATIONAL", bookType: "multi", copies: 2, deliveryRequired: true }, 114],
  ["INTL · multi + 2 extra copies · delivery", { market: "INTERNATIONAL", bookType: "multi", copies: 3, deliveryRequired: true }, 144],
];

let failed = 0;
for (const [name, opts, expected] of CASES) {
  const got = grandTotal(opts);
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(40)} got ${got}  expected ${expected}`);
}
console.log(failed === 0 ? "\nAll pricing cases pass." : `\n${failed} FAILING case(s).`);
process.exit(failed === 0 ? 0 : 1);
