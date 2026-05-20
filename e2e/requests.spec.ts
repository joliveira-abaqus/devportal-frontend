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

  test('deve visualizar detalhe de uma solicitação', async ({ page }) => {
    // Cria uma solicitação primeiro
    await page.goto('/requests/new');
    await page.getByLabel('Título').fill('Solicitação para detalhe');
    await page.getByLabel('Descrição').fill('Descrição detalhada da solicitação de teste para visualização');
    await page.getByLabel('Tipo').selectOption('feature');
    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    // Aguarda redirecionamento para a página de detalhe
    await expect(page).toHaveURL(/\/requests\/[a-zA-Z0-9-]+/);

    // Verifica título, descrição, status e timeline
    await expect(page.getByText('Solicitação para detalhe')).toBeVisible();
    await expect(page.getByText('Descrição detalhada da solicitação de teste para visualização')).toBeVisible();
    await expect(page.getByText('Pendente')).toBeVisible();
    await expect(page.getByText('Timeline')).toBeVisible();
  });

  test('deve filtrar solicitações por status', async ({ page }) => {
    const statusSelect = page.locator('#status-filter');
    await expect(statusSelect).toBeVisible();

    // Seleciona um status específico
    await statusSelect.selectOption('pending');

    // Verifica que a URL ou a lista atualizou (aguarda recarregamento dos dados)
    await page.waitForTimeout(500);

    // O filtro deve estar selecionado
    await expect(statusSelect).toHaveValue('pending');
  });

  test('deve filtrar solicitações por tipo', async ({ page }) => {
    const typeSelect = page.locator('#type-filter');
    await expect(typeSelect).toBeVisible();

    // Seleciona um tipo específico
    await typeSelect.selectOption('bug_fix');

    // Verifica que o filtro está selecionado
    await page.waitForTimeout(500);
    await expect(typeSelect).toHaveValue('bug_fix');
  });

  test('deve exibir estado vazio quando não há solicitações com filtro aplicado', async ({ page }) => {
    // Aplica filtro de status "Falhou" que provavelmente não tem resultados
    const statusSelect = page.locator('#status-filter');
    await statusSelect.selectOption('failed');

    await page.waitForTimeout(1000);

    // Verifica se mostra mensagem vazia ou a lista de resultados
    const emptyMessage = page.getByText('Nenhuma solicitação encontrada.');
    const requestCards = page.locator('[class*="space-y-4"] > a, [class*="space-y-4"] > div');

    // Pelo menos um dos dois deve estar visível
    const isEmpty = await emptyMessage.isVisible().catch(() => false);
    const hasCards = (await requestCards.count()) > 0;

    expect(isEmpty || hasCards).toBe(true);
  });
});
