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

  // --- Cenários de borda ---

  test('deve exibir erro de validação com email em formato inválido', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('abc');
    await page.getByLabel('Senha').fill('qualquersenha');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
  });

  test('deve exibir erro de validação com email sem domínio', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('abc@');
    await page.getByLabel('Senha').fill('qualquersenha');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
  });

  test('deve exibir erro de validação com email começando com @', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('@test.com');
    await page.getByLabel('Senha').fill('qualquersenha');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
  });

  test('deve exibir erro de validação com email vazio e senha preenchida', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Senha').fill('qualquersenha');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
  });

  test('deve exibir erro de validação com senha vazia e email preenchido', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('teste@test.com');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Senha é obrigatória')).toBeVisible();
  });

  test('deve exibir erros de validação com ambos campos vazios', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('Senha é obrigatória')).toBeVisible();
  });

  test('deve redirecionar /requests/new para login quando não autenticado', async ({ page }) => {
    await page.goto('/requests/new');
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/callbackUrl/);
  });

  test('deve redirecionar /requests/123 para login quando não autenticado', async ({ page }) => {
    await page.goto('/requests/123');
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve exibir página de registro com todos os campos', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByLabel('Nome')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirmar Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Criar Conta' })).toBeVisible();
  });

  test('deve validar campos vazios no registro', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page.getByText('Nome deve ter pelo menos 2 caracteres')).toBeVisible();
    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('Senha deve ter pelo menos 8 caracteres')).toBeVisible();
  });

  test('deve validar senha fraca no registro', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Nome').fill('Teste');
    await page.getByLabel('Email').fill('novo@test.com');
    await page.getByLabel('Senha', { exact: true }).fill('123');
    await page.getByLabel('Confirmar Senha').fill('123');
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page.getByText('Senha deve ter pelo menos 8 caracteres')).toBeVisible();
  });

  test('deve validar senhas que não coincidem no registro', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Nome').fill('Teste');
    await page.getByLabel('Email').fill('novo@test.com');
    await page.getByLabel('Senha', { exact: true }).fill('SenhaForte123!');
    await page.getByLabel('Confirmar Senha').fill('SenhaDiferente456!');
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page.getByText('Senhas não coincidem')).toBeVisible();
  });

  test('deve exibir link para registro na página de login', async ({ page }) => {
    await page.goto('/login');

    const registerLink = page.getByRole('link', { name: 'Registre-se' });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('deve exibir link para login na página de registro', async ({ page }) => {
    await page.goto('/register');

    const loginLink = page.getByRole('link', { name: 'Faça login' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('deve preservar callbackUrl após redirecionamento para login', async ({ page }) => {
    await page.goto('/requests/new');
    await expect(page).toHaveURL(/\/login/);

    const url = page.url();
    expect(url).toContain('callbackUrl');
    expect(url).toContain('requests');
  });

  test('não deve submeter o formulário de login enquanto estiver carregando', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Senha').fill(TEST_PASSWORD);

    const submitButton = page.getByRole('button', { name: 'Entrar' });

    // Clicar uma vez
    await submitButton.click();

    // Botão deve estar desabilitado durante o carregamento
    await expect(page.getByText('Carregando...')).toBeVisible();
  });
});
