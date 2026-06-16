import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/** Formata data no padrão brasileiro */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

/** Formata data relativa (ex: "há 2 horas") */
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}
