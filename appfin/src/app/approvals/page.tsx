'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'

interface Approval {
  id: string
  budgetId: string
  userId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  comment?: string
  createdAt: string
  updatedAt: string
  budget: {
    id: string
    name: string
    description?: string
    amount: number
    status: string
    createdAt: string
    project: {
      id: string
      name: string
    }
    user: {
      id: string
      name?: string
      email: string
    }
  }
  user: {
    id: string
    name?: string
    email: string
  }
}

interface WorkflowInstance {
  id: string
  budgetId: string
  workflowId: string
  currentStep: number
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  startedAt: string
  completedAt?: string
  budget: {
    id: string
    name: string
    amount: number
    status: string
  }
  workflow: {
    id: string
    name: string
  }
}

export default function Approvals() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [workflowInstances, setWorkflowInstances] = useState<WorkflowInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchApprovals()
      fetchWorkflowInstances()
    }
  }, [session, filter])

  const fetchApprovals = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/approvals?filter=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setApprovals(data)
      } else {
        setError('Erro ao carregar aprovações')
      }
    } catch (error) {
      console.error('Erro ao buscar aprovações:', error)
      setError('Erro ao carregar aprovações')
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkflowInstances = async () => {
    try {
      const response = await fetch('/api/workflows/instances')
      if (response.ok) {
        const data = await response.json()
        setWorkflowInstances(data)
      }
    } catch (error) {
      console.error('Erro ao buscar instâncias de workflow:', error)
    }
  }

  const handleApproval = async (approvalId: string, status: 'APPROVED' | 'REJECTED', comment?: string) => {
    try {
      const response = await fetch(`/api/approvals/${approvalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, comment }),
      })

      if (response.ok) {
        fetchApprovals()
        fetchWorkflowInstances()
      } else {
        setError('Erro ao atualizar aprovação')
      }
    } catch (error) {
      console.error('Erro ao aprovar/rejeitar:', error)
      setError('Erro ao processar aprovação')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'APPROVED':
        return 'Aprovado'
      case 'REJECTED':
        return 'Rejeitado'
      default:
        return status
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Aprovações</h1>
              <p className="text-gray-600 mt-2">
                Gerencie todas as aprovações pendentes e workflows em andamento
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Todas
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvals.filter(a => a.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvals.filter(a => a.status === 'APPROVED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvals.filter(a => a.status === 'REJECTED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Workflows Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflowInstances.filter(w => w.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Aprovações Pendentes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aprovações {filter === 'pending' ? 'Pendentes' : 'Todas'}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando aprovações...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : approvals.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <span className="text-4xl mb-4 block">🎉</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma aprovação pendente!
              </h3>
              <p className="text-gray-600">
                {filter === 'pending' 
                  ? 'Você não tem aprovações pendentes no momento.'
                  : 'Nenhuma aprovação encontrada.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {approvals.map((approval) => (
                <div key={approval.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {approval.budget.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Projeto: {approval.budget.project.name}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                      {getStatusText(approval.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium">
                        R$ {approval.budget.amount.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Solicitante:</span>
                      <span className="font-medium">
                        {approval.budget.user.name || approval.budget.user.email}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">
                        {new Date(approval.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {approval.budget.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Descrição:</strong> {approval.budget.description}
                      </p>
                    </div>
                  )}

                  {approval.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproval(approval.id, 'APPROVED')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Aprovar
                      </button>
                      <button
                        onClick={() => {
                          const comment = prompt('Motivo da rejeição (opcional):')
                          handleApproval(approval.id, 'REJECTED', comment || undefined)
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ❌ Rejeitar
                      </button>
                    </div>
                  )}

                  {approval.comment && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Comentário:</strong> {approval.comment}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workflows em Andamento */}
        {workflowInstances.filter(w => w.status === 'IN_PROGRESS').length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflows em Andamento</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflowInstances
                .filter(w => w.status === 'IN_PROGRESS')
                .map((instance) => (
                  <div key={instance.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {instance.budget.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Workflow: {instance.workflow.name}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Passo {instance.currentStep}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-medium">
                          R$ {instance.budget.amount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Iniciado:</span>
                        <span className="font-medium">
                          {new Date(instance.startedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(instance.currentStep / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


