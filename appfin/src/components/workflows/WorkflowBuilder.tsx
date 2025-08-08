'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const workflowSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
})

type WorkflowFormData = z.infer<typeof workflowSchema>

interface WorkflowBuilderProps {
  onCreated: () => void
  onCancel: () => void
}

interface WorkflowStep {
  id: string
  type: 'START' | 'APPROVER' | 'CONDITION' | 'ACTION' | 'END'
  name: string
  approverId?: string
  timeoutDays: number
  conditions?: string
}

export default function WorkflowBuilder({ onCreated, onCancel }: WorkflowBuilderProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', type: 'START', name: 'Início', timeoutDays: 0 },
    { id: '2', type: 'APPROVER', name: 'Gerente', timeoutDays: 2 },
    { id: '3', type: 'END', name: 'Fim', timeoutDays: 0 },
  ])
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
  })

  const addStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type,
      name: type === 'APPROVER' ? 'Aprovador' : type === 'CONDITION' ? 'Condição' : 'Ação',
      timeoutDays: type === 'APPROVER' ? 2 : 0,
    }
    setSteps([...steps.slice(0, -1), newStep, steps[steps.length - 1]])
  }

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setSteps(steps.map(step => step.id === id ? { ...step, ...updates } : step))
  }

  const removeStep = (id: string) => {
    if (steps.length > 2) {
      setSteps(steps.filter(step => step.id !== id))
    }
  }

  const onSubmit = async (data: WorkflowFormData) => {
    try {
      setLoading(true)
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          steps,
        }),
      })

      if (response.ok) {
        onCreated()
      } else {
        console.error('Erro ao criar workflow')
      }
    } catch (error) {
      console.error('Erro ao criar workflow:', error)
    } finally {
      setLoading(false)
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

  const getStepColor = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'START': return 'bg-green-100 text-green-800'
      case 'APPROVER': return 'bg-blue-100 text-blue-800'
      case 'CONDITION': return 'bg-yellow-100 text-yellow-800'
      case 'ACTION': return 'bg-purple-100 text-purple-800'
      case 'END': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Builder</h1>
            <p className="text-gray-600 mt-2">
              Configure seu fluxo de aprovação visualmente
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Workflow'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflow Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Workflow</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Workflow
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Aprovação de Orçamentos"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva o propósito deste workflow..."
                />
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ferramentas</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => addStep('APPROVER')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                👤 Adicionar Aprovador
              </button>
              <button
                onClick={() => addStep('CONDITION')}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                ❓ Adicionar Condição
              </button>
              <button
                onClick={() => addStep('ACTION')}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                ⚡ Adicionar Ação
              </button>
            </div>
          </div>
        </div>

        {/* Visual Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fluxo Visual</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
              <div className="flex flex-wrap gap-4 justify-center">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    {/* Step */}
                    <div
                      className={`cursor-pointer p-4 rounded-lg border-2 ${
                        selectedStep === step.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      } hover:border-blue-300 transition-colors`}
                      onClick={() => setSelectedStep(step.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{getStepIcon(step.type)}</div>
                        <div className="text-sm font-medium text-gray-900">{step.name}</div>
                        {step.type === 'APPROVER' && (
                          <div className="text-xs text-gray-500 mt-1">
                            {step.timeoutDays} dias
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="mx-2 text-gray-400">
                        <span className="text-xl">→</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Configuration */}
          {selectedStep && (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configurar: {steps.find(s => s.id === selectedStep)?.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={steps.find(s => s.id === selectedStep)?.name || ''}
                    onChange={(e) => updateStep(selectedStep, { name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {steps.find(s => s.id === selectedStep)?.type === 'APPROVER' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeout (dias)
                    </label>
                    <input
                      type="number"
                      value={steps.find(s => s.id === selectedStep)?.timeoutDays || 0}
                      onChange={(e) => updateStep(selectedStep, { timeoutDays: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => removeStep(selectedStep)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Remover
                  </button>
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
