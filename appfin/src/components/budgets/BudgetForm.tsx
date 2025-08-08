'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const budgetSchema = z.object({
  projectId: z.string().min(1, 'Projeto é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  workflowId: z.string().optional(),
})

type BudgetFormData = z.infer<typeof budgetSchema>

interface Project {
  id: string
  name: string
  description?: string
}

interface Workflow {
  id: string
  name: string
  description?: string
  isActive: boolean
  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  stepNumber: number
  name: string
  type: string
  approverId?: string
  approverType?: string
}

interface BudgetFormProps {
  projects: Project[]
  workflows: Workflow[]
  onCreated: (budgetId: string, workflowId?: string) => void
}

export default function BudgetForm({ projects, workflows, onCreated }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
  })

  const onSubmit = async (data: BudgetFormData) => {
    try {
      setIsSubmitting(true)

      // Criar orçamento
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: data.projectId,
          name: data.name,
          description: data.description,
          amount: data.amount,
        }),
      })

      if (response.ok) {
        const budget = await response.json()
        
        // Se um workflow foi selecionado, executá-lo
        if (data.workflowId) {
          onCreated(budget.id, data.workflowId)
        } else {
          onCreated(budget.id)
        }
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao criar orçamento')
      }
    } catch (error) {
      console.error('Erro ao criar orçamento:', error)
      alert('Erro ao criar orçamento')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWorkflowChange = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId)
    setSelectedWorkflow(workflow || null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Orçamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Projeto *
            </label>
            <select
              id="projectId"
              {...register('projectId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Orçamento *
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Aquisição de equipamentos"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o propósito deste orçamento..."
          />
        </div>

        <div className="mt-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Valor (R$) *
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0,00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>
      </div>

      {/* Seleção de Workflow */}
      {workflows.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fluxo de Aprovação</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="workflowId" className="block text-sm font-medium text-gray-700 mb-2">
                Workflow de Aprovação
              </label>
              <select
                id="workflowId"
                {...register('workflowId')}
                onChange={(e) => handleWorkflowChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sem workflow (apenas orçamento)</option>
                {workflows.map((workflow) => (
                  <option key={workflow.id} value={workflow.id}>
                    {workflow.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview do Workflow Selecionado */}
            {selectedWorkflow && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  📋 {selectedWorkflow.name}
                </h4>
                {selectedWorkflow.description && (
                  <p className="text-blue-700 text-sm mb-3">{selectedWorkflow.description}</p>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900">Fluxo de Aprovação:</p>
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    {selectedWorkflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                          {step.name}
                        </span>
                        {index < selectedWorkflow.steps.length - 1 && (
                          <span className="text-blue-400 mx-1">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Criando...' : 'Criar Orçamento'}
        </button>
      </div>
    </form>
  )
}
