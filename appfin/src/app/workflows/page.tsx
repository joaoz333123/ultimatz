'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import WorkflowBuilder from '@/components/workflows/WorkflowBuilder'
import WorkflowList from '@/components/workflows/WorkflowList'

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

export default function Workflows() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templateConfig, setTemplateConfig] = useState({
    customName: '',
    approverIds: [] as string[],
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchWorkflows()
    }
  }, [session])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data)
      } else {
        setError('Erro ao carregar workflows')
      }
    } catch (error) {
      console.error('Erro ao buscar workflows:', error)
      setError('Erro ao carregar workflows')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkflow = () => {
    setShowBuilder(true)
  }

  const handleWorkflowCreated = () => {
    setShowBuilder(false)
    fetchWorkflows()
  }

  const handleUseTemplate = (templateName: string) => {
    setSelectedTemplate(templateName)
    setTemplateConfig({
      customName: `${templateName} - ${new Date().toLocaleDateString('pt-BR')}`,
      approverIds: [],
    })
    setShowTemplateModal(true)
  }

  const handleCreateFromTemplate = async () => {
    try {
      const response = await fetch('/api/workflows/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateName: selectedTemplate,
          customName: templateConfig.customName,
          approverIds: templateConfig.approverIds,
        }),
      })

      if (response.ok) {
        setShowTemplateModal(false)
        fetchWorkflows()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar workflow do template')
      }
    } catch (error) {
      console.error('Erro ao criar workflow do template:', error)
      setError('Erro ao criar workflow do template')
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

  if (showBuilder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <WorkflowBuilder onCreated={handleWorkflowCreated} onCancel={() => setShowBuilder(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflow Builder</h1>
              <p className="text-gray-600 mt-2">
                Configure fluxos de aprovação visualmente em 5 minutos!
              </p>
            </div>
            <button
              onClick={handleCreateWorkflow}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Criar Workflow</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows.filter(w => w.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Templates Prontos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200 hover:border-blue-500 cursor-pointer">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🏢</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprovação Simples</h3>
                <p className="text-gray-600 mb-4">Aprovação direta por um gerente</p>
                <div className="text-sm text-gray-500 mb-4">
                  <div>📥 Pedido → 👤 Gerente → ✅ Aprovado</div>
                </div>
                <button 
                  onClick={() => handleUseTemplate('Aprovação Simples')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Usar Template
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200 hover:border-blue-500 cursor-pointer">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🏢</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprovação Dupla</h3>
                <p className="text-gray-600 mb-4">Aprovação por gerente e diretor</p>
                <div className="text-sm text-gray-500 mb-4">
                  <div>📥 Pedido → 👤 Gerente → 👔 Diretor → ✅ Aprovado</div>
                </div>
                <button 
                  onClick={() => handleUseTemplate('Aprovação Dupla')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Usar Template
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200 hover:border-blue-500 cursor-pointer">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🏢</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprovação Tripla</h3>
                <p className="text-gray-600 mb-4">Aprovação por gerente, diretor e CFO</p>
                <div className="text-sm text-gray-500 mb-4">
                  <div>📥 Pedido → 👤 Gerente → 👔 Diretor → 💼 CFO → ✅ Aprovado</div>
                </div>
                <button 
                  onClick={() => handleUseTemplate('Aprovação Tripla')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Usar Template
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Seus Workflows</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando workflows...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <WorkflowList workflows={workflows} onRefresh={fetchWorkflows} />
          )}
        </div>
      </div>

      {/* Modal de Configuração de Template */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configurar {selectedTemplate}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Workflow
                </label>
                <input
                  type="text"
                  value={templateConfig.customName}
                  onChange={(e) => setTemplateConfig(prev => ({ ...prev, customName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do workflow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aprovadores (IDs separados por vírgula)
                </label>
                <input
                  type="text"
                  value={templateConfig.approverIds.join(', ')}
                  onChange={(e) => setTemplateConfig(prev => ({ 
                    ...prev, 
                    approverIds: e.target.value.split(',').map(id => id.trim()).filter(id => id)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user1, user2, user3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  IDs dos usuários que serão aprovadores (opcional)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFromTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Criar Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
