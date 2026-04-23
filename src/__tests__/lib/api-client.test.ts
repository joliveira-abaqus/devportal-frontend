describe('apiClient', () => {
  let mockCreate: jest.Mock;
  let mockResponseUse: jest.Mock;
  let mockInstance: Record<string, unknown>;

  beforeEach(() => {
    jest.resetModules();

    mockResponseUse = jest.fn();
    mockInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: mockResponseUse },
      },
    };
    mockCreate = jest.fn(() => mockInstance);

    jest.doMock('axios', () => ({
      __esModule: true,
      default: { create: mockCreate },
    }));
  });

  it('deve criar instância do axios com configuração correta', () => {
    require('@/lib/api-client');

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3001',
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('deve registrar interceptor de resposta', () => {
    require('@/lib/api-client');

    expect(mockResponseUse).toHaveBeenCalledTimes(1);
    expect(mockResponseUse).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('deve redirecionar para /login em erro 401', () => {
    require('@/lib/api-client');

    const errorHandler = mockResponseUse.mock.calls[0][1];
    const mockError = { response: { status: 401 } };

    delete (window as { location?: unknown }).location;
    (window as { location: { href: string } }).location = { href: '' };

    expect(() => errorHandler(mockError)).rejects.toBeDefined();
  });
});
