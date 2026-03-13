import { test, expect } from '@playwright/test';

test.describe('Quiz Application', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Quiz/i);
    await expect(page.getByText('Quiz Ciencia')).toBeVisible();
  });

  test('should navigate to quiz page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=¡Jugar Ahora!');
    await expect(page).toHaveURL(/\/quiz/);
  });

  test('should display level selection', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page.getByText('Selecciona tu nivel')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Quiz Ciencia')).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText('Quiz Ciencia')).toBeVisible();
  });

  test('should load quiz questions', async ({ page }) => {
    await page.goto('/quiz?level=ni%C3%B1o');
    await page.waitForTimeout(3000);
    await expect(page.getByText(/pregunta \d+ de/i)).toBeVisible();
  });
});
