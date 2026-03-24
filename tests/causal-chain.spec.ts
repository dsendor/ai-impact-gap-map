import { test, expect } from "@playwright/test";

test.describe("Causal Chain - Phase 3", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  async function openFirstTocPanel(page: any) {
    // Scroll to All Theories of Change section
    await page.getByText("All Theories of Change").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const firstCard = page.locator('[data-testid="toc-card"]').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click();
    await page.waitForTimeout(500);
  }

  test("chain viz opens on ToC click and shows nodes", async ({ page }) => {
    await openFirstTocPanel(page);

    const panel = page.locator('[data-testid="toc-detail-panel"]');
    await expect(panel).toBeVisible();

    const chainViz = panel.locator('[data-testid="causal-chain-viz"]');
    await expect(chainViz).toBeVisible();

    const nodes = panel.locator('[data-testid="chain-node"]');
    const count = await nodes.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("click node expands details", async ({ page }) => {
    await openFirstTocPanel(page);

    const panel = page.locator('[data-testid="toc-detail-panel"]');
    await expect(panel).toBeVisible();

    const firstNode = panel.locator('[data-testid="chain-node"]').first();
    await firstNode.click();
    await page.waitForTimeout(300);

    const text = await panel.textContent();
    expect(text?.length).toBeGreaterThan(100);
  });

  test("investable insight CTA is visible", async ({ page }) => {
    await openFirstTocPanel(page);

    const panel = page.locator('[data-testid="toc-detail-panel"]');
    await expect(panel).toBeVisible();

    const cta = panel.locator('[data-testid="investable-insight-cta"]');
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
  });

  test("ESC closes panel", async ({ page }) => {
    await openFirstTocPanel(page);

    const panel = page.locator('[data-testid="toc-detail-panel"]');
    await expect(panel).toBeVisible();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await expect(panel).not.toBeVisible();
  });
});
