import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'dev@devportal.local';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'DevPortal123!';

test.describe('Solicitações', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/login');
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Senha').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('deve exibir a lista de solicitações no dashboard', async ({ page }) => {
    await expect(page.getByText('Minhas Solicitações')).toBeVisible();
    await expect(page.getByText('Nova Solicitação')).toBeVisible();
  });

  test('deve navegar para o formulário de nova solicitação', async ({ page }) => {
    await page.getByRole('link', { name: 'Nova Solicitação' }).first().click();
    await expect(page).toHaveURL(/\/requests\/new/);
    await expect(page.getByLabel('Título')).toBeVisible();
    await expect(page.getByLabel('Descrição')).toBeVisible();
    await expect(page.getByLabel('Tipo')).toBeVisible();
  });

  test('deve validar campos obrigatórios ao criar solicitação', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    await expect(
      page.getByText('Título deve ter pelo menos 3 caracteres'),
    ).toBeVisible();
    await expect(
      page.getByText('Descrição deve ter pelo menos 10 caracteres'),
    ).toBeVisible();
  });

  test('deve criar uma nova solicitação com sucesso', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('Corrigir bug no login');
    await page.getByLabel('Descrição').fill('O botão de login não funciona quando o email contém caracteres especiais');
    await page.getByLabel('Tipo').selectOption('bug_fix');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    // Deve redirecionar para o detalhe da solicitação
    await expect(page).toHaveURL(/\/requests\/[a-zA-Z0-9-]+/);
    await expect(page.getByText('Corrigir bug no login')).toBeVisible();
  });

  test('deve exibir filtros de status e tipo', async ({ page }) => {
    await expect(page.getByText('Todos os status')).toBeVisible();
    await expect(page.getByText('Todos os tipos')).toBeVisible();
  });
});
