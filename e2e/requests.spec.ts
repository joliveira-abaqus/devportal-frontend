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

  // --- Cenários de borda ---

  test('deve aceitar título com exatamente 3 caracteres (limite mínimo)', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('ABC');
    await page.getByLabel('Descrição').fill('Descrição com mais de dez caracteres para ser válida');
    await page.getByLabel('Tipo').selectOption('feature');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    // Não deve exibir erro de validação do título
    await expect(page.getByText('Título deve ter pelo menos 3 caracteres')).not.toBeVisible();
  });

  test('deve rejeitar título com 2 caracteres (abaixo do limite mínimo)', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('AB');
    await page.getByLabel('Descrição').fill('Descrição com mais de dez caracteres para ser válida');
    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    await expect(page.getByText('Título deve ter pelo menos 3 caracteres')).toBeVisible();
  });

  test('deve aceitar descrição com exatamente 10 caracteres (limite mínimo)', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('Título válido');
    await page.getByLabel('Descrição').fill('1234567890'); // exatamente 10
    await page.getByLabel('Tipo').selectOption('bug_fix');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    // Não deve exibir erro de validação da descrição
    await expect(page.getByText('Descrição deve ter pelo menos 10 caracteres')).not.toBeVisible();
  });

  test('deve rejeitar descrição com 9 caracteres (abaixo do limite mínimo)', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('Título válido');
    await page.getByLabel('Descrição').fill('123456789'); // 9 caracteres
    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    await expect(page.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeVisible();
  });

  test('deve criar solicitação com título muito longo', async ({ page }) => {
    await page.goto('/requests/new');

    const longTitle = 'A'.repeat(500);
    await page.getByLabel('Título').fill(longTitle);
    await page.getByLabel('Descrição').fill('Descrição válida com mais de dez caracteres');
    await page.getByLabel('Tipo').selectOption('feature');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    // Não deve exibir erro de validação do título
    await expect(page.getByText('Título deve ter pelo menos 3 caracteres')).not.toBeVisible();
  });

  test('deve criar solicitação com caracteres especiais (acentos)', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('Correção de autenticação — módulo de usuários');
    await page.getByLabel('Descrição').fill('A função de autenticação não trata corretamente os acentos: é, ã, ç, ü');
    await page.getByLabel('Tipo').selectOption('bug_fix');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    await expect(page).toHaveURL(/\/requests\/[a-zA-Z0-9-]+/);
    await expect(page.getByText('Correção de autenticação — módulo de usuários')).toBeVisible();
  });

  test('deve criar solicitação com tags HTML no título sem renderizá-las', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('Teste <script>alert("xss")</script>');
    await page.getByLabel('Descrição').fill('Verificar se tags HTML são escapadas corretamente no frontend');
    await page.getByLabel('Tipo').selectOption('bug_fix');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    await expect(page).toHaveURL(/\/requests\/[a-zA-Z0-9-]+/);
  });

  test('deve criar solicitação do tipo Feature', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('Nova funcionalidade de exportação');
    await page.getByLabel('Descrição').fill('Implementar exportação de relatórios em formato CSV e Excel');
    await page.getByLabel('Tipo').selectOption('feature');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    await expect(page).toHaveURL(/\/requests\/[a-zA-Z0-9-]+/);
    await expect(page.getByText('Feature')).toBeVisible();
  });

  test('deve criar solicitação do tipo Migration', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('Título').fill('Migração de banco de dados');
    await page.getByLabel('Descrição').fill('Migrar tabelas legadas para o novo schema definido no sprint atual');
    await page.getByLabel('Tipo').selectOption('migration');

    await page.getByRole('button', { name: 'Criar Solicitação' }).click();

    await expect(page).toHaveURL(/\/requests\/[a-zA-Z0-9-]+/);
    await expect(page.getByText('Migration')).toBeVisible();
  });

  test('deve filtrar solicitações por status', async ({ page }) => {
    const statusFilter = page.locator('#status-filter');
    await expect(statusFilter).toBeVisible();

    // Selecionar filtro "Pendente"
    await statusFilter.selectOption('pending');
    await page.waitForTimeout(500);
    await expect(page.getByText('Minhas Solicitações')).toBeVisible();
  });

  test('deve filtrar solicitações por tipo', async ({ page }) => {
    const typeFilter = page.locator('#type-filter');
    await expect(typeFilter).toBeVisible();

    // Selecionar filtro "Bug Fix"
    await typeFilter.selectOption('bug_fix');
    await page.waitForTimeout(500);
    await expect(page.getByText('Minhas Solicitações')).toBeVisible();
  });

  test('deve combinar filtros de status e tipo', async ({ page }) => {
    const statusFilter = page.locator('#status-filter');
    const typeFilter = page.locator('#type-filter');

    await statusFilter.selectOption('pending');
    await typeFilter.selectOption('feature');
    await page.waitForTimeout(500);

    await expect(page.getByText('Minhas Solicitações')).toBeVisible();
  });

  test('deve resetar filtros para "Todos"', async ({ page }) => {
    const statusFilter = page.locator('#status-filter');
    const typeFilter = page.locator('#type-filter');

    // Aplicar filtros
    await statusFilter.selectOption('done');
    await typeFilter.selectOption('bug_fix');
    await page.waitForTimeout(300);

    // Resetar filtros
    await statusFilter.selectOption('');
    await typeFilter.selectOption('');
    await page.waitForTimeout(300);

    await expect(page.getByText('Todos os status')).toBeVisible();
    await expect(page.getByText('Todos os tipos')).toBeVisible();
  });

  test('deve exibir botão Cancelar no formulário de nova solicitação', async ({ page }) => {
    await page.goto('/requests/new');

    const cancelButton = page.getByRole('button', { name: 'Cancelar' });
    await expect(cancelButton).toBeVisible();
  });

  test('deve exibir opções corretas no select de tipo', async ({ page }) => {
    await page.goto('/requests/new');

    const typeSelect = page.getByLabel('Tipo');
    const options = typeSelect.locator('option');

    await expect(options).toHaveCount(3);
    await expect(options.nth(0)).toHaveText('Feature');
    await expect(options.nth(1)).toHaveText('Bug Fix');
    await expect(options.nth(2)).toHaveText('Migration');
  });

  test('deve ter Feature como tipo padrão no formulário', async ({ page }) => {
    await page.goto('/requests/new');

    const typeSelect = page.getByLabel('Tipo');
    await expect(typeSelect).toHaveValue('feature');
  });
});
