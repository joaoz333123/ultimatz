'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface Workflow {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  stepNumber: number
  name: string
  type: 'START' | 'APPROVER' | 'CONDITION' | 'ACTION' | 'END'
  approverId?: string
  approverType?: 'USER' | 'ROLE' | 'DEPARTMENT'
  isRequired: boolean
  timeoutDays: number
  conditions?: string
}

interface WorkflowListProps {
  workflows: Workflow[]
  onRefresh: () => void
}

export default function WorkflowList({ workflows, onRefresh }: WorkflowListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleActive = async (workflowId: string, currentStatus: boolean) => {
    try {
      setLoading(workflowId)
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Erro ao atualizar workflow:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (workflowId: string) => {
    if (!confirm('Tem certeza que deseja excluir este workflow?')) {
      return
    }

    try {
      setLoading(workflowId)
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Erro ao deletar workflow:', error)
    } finally {
      setLoading(null)
    }
  }

  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'START': return '📥'
      case 'APPROVER': return '👤'
      case 'CONDITION': return '❓'
      case 'ACTION': return '⚡'
      case 'END': return '✅'
      default: return '📋'
    }
  }

  const renderWorkflowSteps = (steps: WorkflowStep[]) => {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <span className="text-lg">{getStepIcon(step.type)}</span>
            <span className="ml-1">{step.name}</span>
            {index < steps.length - 1 && <span className="mx-1">→</span>}
          </div>
        ))}
      </div>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Crie seu primeiro workflow!
        </h3>
        <p className="text-gray-600 mb-6">
          Configure fluxos de aprovação visualmente em 5 minutos
        </p>
        <div className="text-sm text-gray-500">
          <p>✅ Interface visual drag & drop</p>
          <p>✅ Templates prontos para usar</p>
          <p>✅ Configuração em 3 passos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <div key={workflow.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {workflow.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              
              {workflow.description && (
                <p className="text-gray-600 mb-3">{workflow.description}</p>
              )}
              
              <div className="mb-3">
                {renderWorkflowSteps(workflow.steps)}
              </div>
              
              <div className="text-sm text-gray-500">
                Criado em {formatDate(new Date(workflow.createdAt))}
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handleToggleActive(workflow.id, workflow.isActive)}
                disabled={loading === workflow.id}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  workflow.isActive
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                } disabled:opacity-50`}
              >
                {loading === workflow.id ? '...' : workflow.isActive ? 'Desativar' : 'Ativar'}
              </button>
              
              <button
                onClick={() => handleDelete(workflow.id)}
                disabled={loading === workflow.id}
                className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
              >
                {loading === workflow.id ? '...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
