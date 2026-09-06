/**
 * Formats the structured {@link DeliveryAddress} into the single free-text
 * `profile.addressText` field the talimoon-intake API accepts (it has no
 * structured address fields — only one optional string, max 600 chars).
 * Pickup orders have no delivery address to report, so this returns
 * `undefined` for anything that isn't an explicit delivery choice.
 */
import type { DeliveryAddress } from "./types";
import type { Market } from "@/components/begin/orderFormData";
import { countryLabel, deliveryRegionLabel } from "@/components/begin/orderFormData";

const ADDRESS_TEXT_MAX = 600;

export function buildAddressText(
  address: DeliveryAddress,
  market: Market,
  locale: "uz" | "en" | "ru",
): string | undefined {
  if (address.choice !== "delivery") return undefined;

  const parts: string[] = [];
  if (market === "INTERNATIONAL") {
    if (address.intlLine1?.trim()) parts.push(address.intlLine1.trim());
    if (address.intlBuilding?.trim()) parts.push(address.intlBuilding.trim());
    if (address.intlApartment?.trim()) parts.push(address.intlApartment.trim());
    if (address.intlCity?.trim()) parts.push(address.intlCity.trim());
    if (address.intlState?.trim()) parts.push(address.intlState.trim());
    if (address.intlPostalCode?.trim()) parts.push(address.intlPostalCode.trim());
    const country = countryLabel(address.countryCode, locale);
    if (country) parts.push(country);
    if (address.intlNote?.trim()) parts.push(address.intlNote.trim());
  } else {
    const region = deliveryRegionLabel(address.regionCode, locale);
    if (region) parts.push(region);
    if (address.district.trim()) parts.push(address.district.trim());
    if (address.street.trim()) parts.push(address.street.trim());
    if (address.building.trim()) parts.push(address.building.trim());
    if (address.apartment?.trim()) parts.push(`kv. ${address.apartment.trim()}`);
    if (address.landmark?.trim()) parts.push(`(${address.landmark.trim()})`);
  }

  const text = parts.filter(Boolean).join(", ");
  return text.length > 0 ? text.slice(0, ADDRESS_TEXT_MAX) : undefined;
}
