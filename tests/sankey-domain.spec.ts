import { test, expect } from "@playwright/test";

test.describe("Sankey & Domain - Phase 2", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("sankey SVG is visible", async ({ page }) => {
    const sankey = page.locator('[data-testid="sankey-diagram"]');
    await page.evaluate(() => {
      document.querySelector('[data-testid="sankey-diagram"]')?.scrollIntoView();
    });
    await page.waitForTimeout(500);
    await expect(sankey).toBeVisible();
    const svg = sankey.locator("svg");
    await expect(svg).toBeVisible();
  });

  test("6 domain tabs render", async ({ page }) => {
    await page.getByText("Domain Deep Dive").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const tabs = page.locator('[data-testid="domain-tab"]');
    const count = await tabs.count();
    expect(count).toBe(6);
  });

  test("clicking domain tab shows content", async ({ page }) => {
    await page.getByText("Domain Deep Dive").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const tabs = page.locator('[data-testid="domain-tab"]');
    await tabs.filter({ hasText: "Education" }).click();
    await page.waitForTimeout(300);
    await expect(page.getByText("Top Opportunities")).toBeVisible();
  });
});
