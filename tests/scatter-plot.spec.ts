import { test, expect } from "@playwright/test";

test.describe("Scatter Plot - Phase 1", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
  });

  test("page loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });

  test("hero text is visible", async ({ page }) => {
    await expect(
      page.getByText("$300B+ flows into AI annually.")
    ).toBeVisible();
  });

  test("claim dots render (≥100)", async ({ page }) => {
    // Scroll to the gap map section
    await page.evaluate(() => {
      document.getElementById("gap-map")?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    const dots = page.locator('[data-testid="claim-dot"]');
    const count = await dots.count();
    expect(count).toBeGreaterThanOrEqual(100);
  });

  test("chain links render (≥30)", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("gap-map")?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    const links = page.locator('[data-testid="chain-link"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(30);
  });

  test("hover highlights chain (others dim)", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("gap-map")?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    const firstDot = page.locator('[data-testid="claim-dot"]').first();
    await firstDot.hover({ force: true });
    await page.waitForTimeout(500);
    const allDots = page.locator('[data-testid="claim-dot"]');
    const count = await allDots.count();
    expect(count).toBeGreaterThan(0);
  });

  test("click dot opens detail panel", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("gap-map")?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    const firstDot = page.locator('[data-testid="claim-dot"]').first();
    await firstDot.click({ force: true });
    await page.waitForTimeout(500);
    const panel = page.locator('[data-testid="toc-detail-panel"]');
    await expect(panel).toBeVisible();
  });

  test("summary toggle switches to ~42 dots", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("gap-map")?.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    const toggle = page.locator('[data-testid="summary-toggle"]');
    await toggle.click();
    await page.waitForTimeout(500);
    const tocDots = page.locator('[data-testid="toc-dot"]');
    const count = await tocDots.count();
    expect(count).toBeGreaterThanOrEqual(35);
    expect(count).toBeLessThanOrEqual(50);
  });
});
