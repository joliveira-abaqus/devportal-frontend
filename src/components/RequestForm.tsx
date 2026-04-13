'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import apiClient from '@/lib/api-client';
import { requestSchema, type RequestFormData } from '@/lib/schemas';
import { useState } from 'react';

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

      const created = response.data.data ?? response.data;
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
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
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
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descrição
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Descreva em detalhes o que precisa ser feito"
          className="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          {...register('description')}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
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
