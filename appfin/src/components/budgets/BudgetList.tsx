'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Budget {
  id: string
  name: string
  description?: string
  amount: number
  spent: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: Date | string
  project: {
    id: string
    name: string
  }
  approvals: Array<{
    id: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    user: {
      name: string
    }
  }>
}

interface BudgetListProps {
  budgets: Budget[]
  onDelete?: (id: string) => Promise<void>
}

export default function BudgetList({ budgets, onDelete }: BudgetListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprovado'
      case 'REJECTED':
        return 'Rejeitado'
      case 'COMPLETED':
        return 'Concluído'
      default:
        return 'Pendente'
    }
  }

  const getProgressPercentage = (spent: number, amount: number) => {
    return Math.min((spent / amount) * 100, 100)
  }

  return (
    <div className="space-y-4">
      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum orçamento encontrado</h3>
          <p className="text-gray-500 mb-4">Comece criando seu primeiro orçamento.</p>
          <Link
            href="/budgets/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Criar Orçamento
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <div key={budget.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Link href={`/budgets/${budget.id}`} className="hover:text-blue-600">
                        {budget.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{budget.project.name}</p>
                    {budget.description && (
                      <p className="text-sm text-gray-600 mb-3">{budget.description}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                    {getStatusText(budget.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valor total:</span>
                    <span className="font-medium">{formatCurrency(budget.amount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gasto:</span>
                    <span className="font-medium">{formatCurrency(budget.spent)}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progresso</span>
                      <span>{getProgressPercentage(budget.spent, budget.amount).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(budget.spent, budget.amount)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Criado em {formatDate(new Date(budget.createdAt))}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    href={`/budgets/${budget.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver detalhes
                  </Link>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/budgets/${budget.id}/edit`}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Editar
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(budget.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
