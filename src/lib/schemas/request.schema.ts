import { z } from 'zod';

export const requestSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(['bug_fix', 'feature', 'migration']),
});

export type RequestFormData = z.infer<typeof requestSchema>;
