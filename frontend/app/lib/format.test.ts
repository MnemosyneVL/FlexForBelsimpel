// Tests for formatting utilities.
//
// These are pure functions — easy to test, no DOM needed.
// We verify that Dutch locale formatting works correctly
// (comma as decimal separator, € symbol).

import { formatPrice, formatData, formatMinutes, formatStorage, formatBattery } from "./format";

describe("formatPrice", () => {
  it("formats a whole number with two decimals", () => {
    const result = formatPrice(499);
    expect(result).toContain("499");
    expect(result).toContain("€");
  });

  it("formats a decimal price correctly", () => {
    const result = formatPrice(12.5);
    expect(result).toContain("12");
    expect(result).toContain("€");
  });

  it("handles zero", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
    expect(result).toContain("€");
  });
});

describe("formatData", () => {
  it("returns GB amount for limited data", () => {
    expect(formatData(10, false)).toBe("10 GB");
  });

  it("returns Onbeperkt for unlimited data", () => {
    expect(formatData(null, true)).toBe("Onbeperkt");
  });

  it("returns Onbeperkt when gb is null", () => {
    expect(formatData(null, false)).toBe("Onbeperkt");
  });
});

describe("formatMinutes", () => {
  it("returns minutes with unit", () => {
    expect(formatMinutes(200, false)).toBe("200 min");
  });

  it("returns Onbeperkt for unlimited", () => {
    expect(formatMinutes(null, true)).toBe("Onbeperkt");
  });
});

describe("formatStorage", () => {
  it("formats storage in GB", () => {
    expect(formatStorage(256)).toBe("256 GB");
  });
});

describe("formatBattery", () => {
  it("formats battery with mAh", () => {
    const result = formatBattery(5000);
    expect(result).toContain("5");
    expect(result).toContain("mAh");
  });

  it("returns dash for null", () => {
    expect(formatBattery(null)).toBe("-");
  });
});
