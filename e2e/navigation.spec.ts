import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'dev@devportal.local';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'DevPortal123!';

test.describe('Navegação', () => {
  test.describe('Navegação autenticada', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Email').fill(TEST_EMAIL);
      await page.getByLabel('Senha').fill(TEST_PASSWORD);
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('deve navegar do dashboard para nova solicitação e voltar', async ({ page }) => {
      // Dashboard → Nova Solicitação
      await page.getByRole('link', { name: 'Nova Solicitação' }).first().click();
      await expect(page).toHaveURL(/\/requests\/new/);

      // Nova Solicitação → Cancelar → volta
      await page.getByRole('button', { name: 'Cancelar' }).click();
      await page.waitForTimeout(500);
    });

    test('deve navegar via sidebar para Dashboard', async ({ page }) => {
      await page.goto('/requests/new');
      await expect(page).toHaveURL(/\/requests\/new/);

      await page.getByRole('link', { name: 'Dashboard' }).click();
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('deve navegar via sidebar para Nova Solicitação', async ({ page }) => {
      await expect(page).toHaveURL(/\/dashboard/);

      await page.locator('nav').getByRole('link', { name: 'Nova Solicitação' }).click();
      await expect(page).toHaveURL(/\/requests\/new/);
    });

    test('deve exibir sidebar em todas as páginas protegidas', async ({ page }) => {
      // Dashboard
      await expect(page.getByText('DevPortal').first()).toBeVisible();
      await expect(page.getByText('Dashboard')).toBeVisible();

      // Nova Solicitação
      await page.goto('/requests/new');
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.locator('nav').getByText('Nova Solicitação')).toBeVisible();
    });

    test('deve exibir header com botão de sair', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    });

    test('deve funcionar o botão voltar do navegador', async ({ page }) => {
      // Dashboard → Nova Solicitação
      await page.getByRole('link', { name: 'Nova Solicitação' }).first().click();
      await expect(page).toHaveURL(/\/requests\/new/);

      // Voltar para Dashboard
      await page.goBack();
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('deve navegar para frente após voltar', async ({ page }) => {
      // Dashboard → Nova Solicitação → Voltar → Avançar
      await page.getByRole('link', { name: 'Nova Solicitação' }).first().click();
      await expect(page).toHaveURL(/\/requests\/new/);

      await page.goBack();
      await expect(page).toHaveURL(/\/dashboard/);

      await page.goForward();
      await expect(page).toHaveURL(/\/requests\/new/);
    });

    test('deve exibir link "Voltar ao Dashboard" na página de detalhes', async ({ page }) => {
      // Criar uma solicitação para ter uma para visualizar
      await page.goto('/requests/new');
      await page.getByLabel('Título').fill('Solicitação para teste de navegação');
      await page.getByLabel('Descrição').fill('Descrição para teste de navegação entre páginas');
      await page.getByLabel('Tipo').selectOption('feature');
      await page.getByRole('button', { name: 'Criar Solicitação' }).click();

      await expect(page).toHaveURL(/\/requests\/[a-zA-Z0-9-]+/);
      await expect(page.getByText('Voltar ao Dashboard')).toBeVisible();

      // Clicar em voltar
      await page.getByText('Voltar ao Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Navegação não autenticada', () => {
    test('deve redirecionar /dashboard para /login', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
    });

    test('deve redirecionar /requests/new para /login', async ({ page }) => {
      await page.goto('/requests/new');
      await expect(page).toHaveURL(/\/login/);
    });

    test('deve redirecionar /requests/123 para /login', async ({ page }) => {
      await page.goto('/requests/123');
      await expect(page).toHaveURL(/\/login/);
    });

    test('deve permitir acesso a /login sem redirecionamento', async ({ page }) => {
      await page.goto('/login');
      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    });

    test('deve permitir acesso a /register sem redirecionamento', async ({ page }) => {
      await page.goto('/register');
      await expect(page).toHaveURL(/\/register/);
      await expect(page.getByRole('button', { name: 'Criar Conta' })).toBeVisible();
    });

    test('deve navegar entre login e registro', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('link', { name: 'Registre-se' }).click();
      await expect(page).toHaveURL(/\/register/);

      await page.getByRole('link', { name: 'Faça login' }).click();
      await expect(page).toHaveURL(/\/login/);
    });

    test('deve preservar callbackUrl no redirecionamento', async ({ page }) => {
      await page.goto('/requests/new');
      const url = page.url();
      expect(url).toContain('callbackUrl');
      expect(url).toContain('requests');
    });
  });
});
