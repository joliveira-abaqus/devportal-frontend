import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RequestsService } from './requests.service';
import { environment } from '../../../environments/environment';

describe('RequestsService', () => {
  let service: RequestsService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/requests`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(RequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar requests', () => {
    const mockRequests = [
      { id: '1', title: 'Request 1', description: 'Desc', type: 'feature', status: 'pending', createdAt: '', updatedAt: '', events: [] },
    ];

    service.getRequests().subscribe((requests) => {
      expect(requests.length).toBe(1);
      expect(requests[0].title).toBe('Request 1');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRequests);
  });

  it('deve buscar requests com filtros', () => {
    service.getRequests({ status: 'pending', type: 'feature' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === baseUrl);
    expect(req.request.params.get('status')).toBe('pending');
    expect(req.request.params.get('type')).toBe('feature');
    req.flush([]);
  });

  it('deve tratar resposta com wrapper data', () => {
    const mockData = { data: [{ id: '1', title: 'T', description: '', type: 'feature', status: 'pending', createdAt: '', updatedAt: '', events: [] }] };

    service.getRequests().subscribe((requests) => {
      expect(requests.length).toBe(1);
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush(mockData);
  });

  it('deve buscar request por id', () => {
    const mockRequest = { id: '123', title: 'Detail', description: '', type: 'bug_fix', status: 'done', createdAt: '', updatedAt: '', events: [] };

    service.getRequestById('123').subscribe((request) => {
      expect(request.id).toBe('123');
      expect(request.title).toBe('Detail');
    });

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRequest);
  });

  it('deve criar request sem arquivo', () => {
    const payload = { title: 'Nova', description: 'Desc', type: 'feature' as const };
    const mockResponse = { id: '1', ...payload, status: 'pending', createdAt: '', updatedAt: '', events: [] };

    service.createRequest(payload).subscribe((request) => {
      expect(request.id).toBe('1');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('Nova');
    req.flush(mockResponse);
  });

  it('deve criar request com arquivo via FormData', () => {
    const file = new File(['conteudo'], 'test.pdf', { type: 'application/pdf' });
    const payload = { title: 'Com arquivo', description: 'Desc', type: 'bug_fix' as const, file };
    const mockResponse = { id: '2', title: 'Com arquivo', description: 'Desc', type: 'bug_fix', status: 'pending', createdAt: '', updatedAt: '', events: [] };

    service.createRequest(payload).subscribe((request) => {
      expect(request.id).toBe('2');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush(mockResponse);
  });
});
