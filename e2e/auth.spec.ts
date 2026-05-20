import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'dev@devportal.local';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'DevPortal123!';

test.describe('Autenticação', () => {
  test('deve exibir a página de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('DevPortal')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('deve fazer login com credenciais válidas e redirecionar para dashboard', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Senha').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Minhas Solicitações')).toBeVisible();
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('invalid@test.com');
    await page.getByLabel('Senha').fill('wrongpassword');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email ou senha inválidos')).toBeVisible();
  });

  test('deve fazer logout', async ({ page }) => {
    // Login primeiro
    await page.goto('/login');
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Senha').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve exibir a página de registro', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText('Criar Conta')).toBeVisible();
    await expect(page.getByLabel('Nome')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('deve redirecionar para login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve registrar nova conta com sucesso', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@devportal.local`;

    await page.goto('/register');

    await page.getByLabel('Nome').fill('Usuário de Teste');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Senha', { exact: true }).fill('SenhaForte123!');
    await page.getByLabel('Confirmar Senha').fill('SenhaForte123!');

    await page.getByRole('button', { name: 'Criar Conta' }).click();

    // Deve redirecionar para login após registro
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve exibir erros de validação no registro', async ({ page }) => {
    await page.goto('/register');

    // Tenta submeter sem preencher campos
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    // Verifica validações
    await expect(page.getByText('Nome deve ter pelo menos 2 caracteres')).toBeVisible();
    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('Senha deve ter pelo menos 8 caracteres')).toBeVisible();
  });

  test('deve exibir erro quando senhas não coincidem no registro', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Nome').fill('Teste');
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Senha', { exact: true }).fill('SenhaForte123!');
    await page.getByLabel('Confirmar Senha').fill('SenhaDiferente456!');

    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page.getByText('Senhas não coincidem')).toBeVisible();
  });

  test('deve redirecionar para dashboard após login via callbackUrl', async ({ page }) => {
    // Acessa /dashboard sem autenticação — middleware redireciona para /login com callbackUrl
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);

    // Verifica que a URL contém callbackUrl
    const url = page.url();
    expect(url).toContain('callbackUrl');

    // Faz login
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Senha').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Deve redirecionar de volta ao dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
