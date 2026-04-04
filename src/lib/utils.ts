import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/** Merge Tailwind classes com clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata data no padrão brasileiro */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

/** Formata data relativa (ex: "há 2 horas") */
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

/** Labels dos tipos de solicitação */
export const requestTypeLabels: Record<string, string> = {
  bug_fix: 'Bug Fix',
  feature: 'Feature',
  migration: 'Migration',
};

/** Labels dos status */
export const requestStatusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
  failed: 'Falhou',
};
