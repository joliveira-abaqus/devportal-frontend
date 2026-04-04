'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import apiClient from '@/lib/api-client';
import { useState } from 'react';

const requestSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(['bug_fix', 'feature', 'migration']),
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function RequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      type: 'feature',
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await apiClient.post('/requests', {
        title: data.title,
        description: data.description,
        type: data.type,
      });

      const created = response.data.data || response.data;
      router.push(`/requests/${created.id}`);
    } catch {
      setSubmitError('Erro ao criar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <Input
        id="title"
        label="Título"
        placeholder="Descreva brevemente a solicitação"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="w-full">
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Descreva em detalhes o que precisa ser feito"
          className="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
          {...register('description')}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Select
        id="type"
        label="Tipo"
        options={[
          { value: 'feature', label: 'Feature' },
          { value: 'bug_fix', label: 'Bug Fix' },
          { value: 'migration', label: 'Migration' },
        ]}
        error={errors.type?.message}
        {...register('type')}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Criar Solicitação
        </Button>
      </div>
    </form>
  );
}
