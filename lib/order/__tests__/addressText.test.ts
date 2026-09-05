import { describe, it, expect } from "vitest";
import { buildAddressText } from "@/lib/order/addressText";
import { emptyDeliveryAddress, type DeliveryAddress } from "@/lib/order/types";

describe("buildAddressText", () => {
  it("returns undefined for pickup (no delivery address to report)", () => {
    const a: DeliveryAddress = { ...emptyDeliveryAddress(), choice: "pickup" };
    expect(buildAddressText(a, "UZ", "uz")).toBeUndefined();
  });

  it("returns undefined when delivery was never chosen", () => {
    const a: DeliveryAddress = emptyDeliveryAddress();
    expect(buildAddressText(a, "UZ", "uz")).toBeUndefined();
  });

  it("formats a UZ delivery address with region, district, street, building", () => {
    const a: DeliveryAddress = {
      ...emptyDeliveryAddress(),
      choice: "delivery",
      regionCode: "tashkent_city",
      district: "Chilonzor",
      street: "Bunyodkor",
      building: "12",
      apartment: "45",
      landmark: "Metro yonida",
    };
    const text = buildAddressText(a, "UZ", "uz")!;
    expect(text).toContain("Chilonzor");
    expect(text).toContain("Bunyodkor");
    expect(text).toContain("12");
    expect(text).toContain("kv. 45");
    expect(text).toContain("Metro yonida");
  });

  it("formats an INTERNATIONAL delivery address with country label", () => {
    const a: DeliveryAddress = {
      ...emptyDeliveryAddress(),
      choice: "delivery",
      countryCode: "US",
      intlLine1: "123 Main St",
      intlCity: "Austin",
      intlState: "TX",
      intlPostalCode: "78701",
    };
    const text = buildAddressText(a, "INTERNATIONAL", "en")!;
    expect(text).toContain("123 Main St");
    expect(text).toContain("Austin");
    expect(text).toContain("United States");
  });

  it("caps the result at 600 characters (backend's addressText limit)", () => {
    const a: DeliveryAddress = {
      ...emptyDeliveryAddress(),
      choice: "delivery",
      regionCode: "tashkent_city",
      district: "D".repeat(400),
      street: "S".repeat(400),
      building: "1",
    };
    const text = buildAddressText(a, "UZ", "uz")!;
    expect(text.length).toBeLessThanOrEqual(600);
  });
});
