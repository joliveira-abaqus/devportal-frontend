import { RequestType, RequestStatus } from '../models';

export const requestTypeLabels: Record<RequestType, string> = {
  bug_fix: 'Bug Fix',
  feature: 'Feature',
  migration: 'Migration',
};

export const requestStatusLabels: Record<RequestStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
  failed: 'Falhou',
};
