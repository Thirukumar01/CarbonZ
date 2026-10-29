import { test, expect } from "@playwright/test";

test.describe("CarbonZ E2E Smoke & Core User Flows", () => {
  test("Landing page loads with core branding and feature sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CarbonZ/);
    await expect(page.locator("text=Verify. Trust. Track.").first()).toBeVisible();
    await expect(page.locator("text=Carbon Trust Score =")).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Carbon Passport" })).toBeVisible();
  });

  test("Project Explorer displays projects, search, and filters", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("text=Carbon Project Explorer")).toBeVisible();
    await expect(page.locator("text=CZ-BRA-2024-001")).toBeVisible();

    // Test search filter input
    const searchInput = page.locator('input[placeholder*="Search by project name"]');
    await searchInput.fill("Gujarat");
    await page.keyboard.press("Enter");

    await expect(page.locator("text=CZ-IND-2024-003")).toBeVisible();
  });

  test("Project Detail displays full evidence dossier and trust score card", async ({ page }) => {
    await page.goto("/projects/amazon-rainforest-corridor-restoration");
    await expect(page.locator("h1")).toContainText("Amazon Rainforest Corridor");
    await expect(page.locator("text=CZ-BRA-2024-001")).toBeVisible();
    await expect(page.locator("text=Carbon Trust Score")).toBeVisible();
    await expect(page.locator("text=83")).toBeVisible();
  });

  test("Carbon Passport displays chronological milestone events", async ({ page }) => {
    await page.goto("/projects/amazon-rainforest-corridor-restoration/passport");
    await expect(page.locator("h1")).toContainText("Carbon Passport");
    await expect(page.locator("text=Chronological Verification Ledger")).toBeVisible();
  });

  test("Project Comparison renders side-by-side evaluation table", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("h1")).toContainText("Compare Carbon Projects");
    await expect(page.locator("text=Side-by-Side Analysis")).toBeVisible();
    await expect(page.locator("table")).toBeVisible();
  });

  test("Auth pages render cleanly with appropriate configuration notices", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Sign in to your account")).toBeVisible();

    await page.goto("/register");
    await expect(page.locator("text=Create your CarbonZ account")).toBeVisible();

    await page.goto("/forgot-password");
    await expect(page.locator("text=Reset Account Password")).toBeVisible();
  });
});

