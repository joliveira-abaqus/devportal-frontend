import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const rawCallbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const callbackUrl = rawCallbackUrl.startsWith('/') && !rawCallbackUrl.startsWith('//') ? rawCallbackUrl : '/dashboard';
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      navigate(callbackUrl);
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-brand-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">DevPortal</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Faça login para acessar o portal</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/30">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Não tem conta?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
