'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import BudgetForm from '@/components/budgets/BudgetForm'

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

export default function NewBudget() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProjects()
      fetchWorkflows()
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        setError('Erro ao carregar projetos')
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
      setError('Erro ao carregar projetos')
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.filter((w: Workflow) => w.isActive))
      }
    } catch (error) {
      console.error('Erro ao buscar workflows:', error)
    }
  }

  const handleBudgetCreated = (budgetId: string, selectedWorkflowId?: string) => {
    if (selectedWorkflowId) {
      // Executar workflow automaticamente
      executeWorkflow(budgetId, selectedWorkflowId)
    } else {
      router.push('/budgets')
    }
  }

  const executeWorkflow = async (budgetId: string, workflowId: string) => {
    try {
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budgetId,
          workflowId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Workflow iniciado:', result)
        router.push('/budgets')
      } else {
        console.error('Erro ao executar workflow')
      }
    } catch (error) {
      console.error('Erro ao executar workflow:', error)
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Novo Orçamento</h1>
          <p className="text-gray-600 mt-2">
            Crie um novo orçamento e configure o fluxo de aprovação
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <BudgetForm 
              projects={projects}
              workflows={workflows}
              onCreated={handleBudgetCreated}
            />
          </div>
        )}
      </div>
    </div>
  )
}

