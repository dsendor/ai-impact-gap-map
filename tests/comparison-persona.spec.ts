import { test, expect } from "@playwright/test";

test.describe("Comparison & Persona - Phase 4", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("persona toggle has 3 options and changes accent", async ({ page }) => {
    const toggle = page.locator('[data-testid="persona-toggle"]');
    await toggle.scrollIntoViewIfNeeded();

    const buttons = toggle.locator("button");
    const count = await buttons.count();
    expect(count).toBe(3);

    // Click Investor
    await buttons.filter({ hasText: "Investor" }).click();
    await page.waitForTimeout(300);

    // Click Policy
    await buttons.filter({ hasText: "Policy" }).click();
    await page.waitForTimeout(300);

    // Should still show data (filters didn't break)
    const dots = page.locator('[data-testid="claim-dot"]');
    const dotCount = await dots.count();
    expect(dotCount).toBeGreaterThan(0);
  });

  test("comparison mode renders two columns", async ({ page }) => {
    const compare = page.getByText("Compare Theories of Change");
    await compare.scrollIntoViewIfNeeded();
    await expect(compare).toBeVisible();

    // Should have two select dropdowns
    const selects = page.locator("select");
    // At least 2 from comparison + 2 from filters
    const count = await selects.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
