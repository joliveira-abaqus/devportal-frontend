import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export const requestTypeLabels: Record<string, string> = {
  bug_fix: 'Bug Fix',
  feature: 'Feature',
  migration: 'Migration',
};

export const requestStatusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
  failed: 'Falhou',
};
