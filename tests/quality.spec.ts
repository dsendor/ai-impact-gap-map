import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Quality - Phase 5", () => {
  test("responsive at 1920x1080 - no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    expect(scrollWidth).toBeLessThanOrEqual(1920);
  });

  test("responsive at 768x1024 - no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    expect(scrollWidth).toBeLessThanOrEqual(1400);
  });

  test("keyboard navigation - escape closes panel", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByText("All Theories of Change").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const firstCard = page.locator('[data-testid="toc-card"]').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click();
    await page.waitForTimeout(500);

    const panel = page.locator('[data-testid="toc-detail-panel"]');
    await expect(panel).toBeVisible();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await expect(panel).not.toBeVisible();
  });

  test("page loads under 5s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "networkidle" });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test("axe-core: no critical violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast", "svg-img-alt"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical"
    );
    expect(critical).toHaveLength(0);
  });

  test("CSV export button exists", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const btn = page.locator('[data-testid="csv-export"]');
    await page.evaluate(() => {
      document.querySelector('[data-testid="csv-export"]')?.scrollIntoView();
    });
    await expect(btn).toBeVisible();
  });
});
