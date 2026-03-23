import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test.describe("Data Export - Phase 0", () => {
  const dataPath = path.join(__dirname, "..", "public", "data.json");

  test("data.json exists and is valid JSON", () => {
    expect(fs.existsSync(dataPath)).toBe(true);
    const raw = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(raw);
    expect(data).toBeTruthy();
  });

  test("has ≥40 ToCs", () => {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    expect(data.theories.length).toBeGreaterThanOrEqual(40);
    expect(data.meta.tocCount).toBeGreaterThanOrEqual(40);
  });

  test("has ≥100 claims", () => {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    expect(data.meta.claimCount).toBeGreaterThanOrEqual(100);
  });

  test("every theory has required fields", () => {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const validDomains = [
      "Healthcare",
      "Education",
      "Climate/Energy",
      "Scientific Research",
      "Labor/Employment",
      "Cross-Domain",
    ];
    const validTypes = ["Benefit", "Harm", "Mitigation"];

    for (const t of data.theories) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(validDomains).toContain(t.domain);
      expect(validTypes).toContain(t.type);
    }
  });

  test("every claim has step and name", () => {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    for (const t of data.theories) {
      for (const c of t.claims) {
        expect(c.step).not.toBeNull();
        expect(c.name).toBeTruthy();
        expect(c.id).toBeTruthy();
      }
    }
  });

  test("no orphan claims (all claims nested under a ToC)", () => {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const totalNested = data.theories.reduce(
      (sum: number, t: any) => sum + t.claims.length,
      0
    );
    expect(totalNested).toBe(data.meta.claimCount);
  });
});
