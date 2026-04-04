'use client';

import Card from '@/components/ui/Card';
import RequestForm from '@/components/RequestForm';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function NewRequestPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Nova Solicitação</h1>
              <p className="mt-1 text-sm text-gray-500">
                Preencha os dados abaixo para criar uma nova solicitação de desenvolvimento
              </p>
            </div>

            <Card>
              <RequestForm />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
