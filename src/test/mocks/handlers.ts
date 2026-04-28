import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3001';

export const handlers = [
  // Login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'dev@devportal.local' && body.password === 'DevPortal123!') {
      return HttpResponse.json({
        data: { id: '1', email: body.email, name: 'Dev User' },
      });
    }
    return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
  }),

  // Registro
  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string };
    return HttpResponse.json({
      data: { id: '2', email: body.email, name: body.name },
    }, { status: 201 });
  }),

  // Listar solicitações
  http.get(`${API_URL}/requests`, () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          title: 'Corrigir bug no login',
          description: 'O botão de login não responde em mobile',
          type: 'bug_fix',
          status: 'pending',
          userId: '1',
          events: [],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Adicionar dark mode',
          description: 'Implementar tema escuro na aplicação',
          type: 'feature',
          status: 'in_progress',
          userId: '1',
          events: [],
          createdAt: '2024-01-14T08:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z',
        },
      ],
    });
  }),

  // Buscar solicitação por ID
  http.get(`${API_URL}/requests/:id`, ({ params }) => {
    return HttpResponse.json({
      data: {
        id: params.id,
        title: 'Corrigir bug no login',
        description: 'O botão de login não responde em mobile',
        type: 'bug_fix',
        status: 'pending',
        userId: '1',
        events: [
          {
            id: 'evt-1',
            requestId: params.id,
            type: 'status_change',
            description: 'Status alterado para Pendente',
            createdAt: '2024-01-15T10:00:00Z',
          },
        ],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    });
  }),

  // Criar solicitação
  http.post(`${API_URL}/requests`, async ({ request }) => {
    const body = (await request.json()) as { title: string; description: string; type: string };
    return HttpResponse.json({
      data: {
        id: '3',
        title: body.title,
        description: body.description,
        type: body.type,
        status: 'pending',
        userId: '1',
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }, { status: 201 });
  }),
];
