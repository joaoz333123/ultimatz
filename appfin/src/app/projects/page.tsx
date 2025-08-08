'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { formatDate } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  createdAt: string
  members: Array<{
    id: string
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
    user: {
      name: string
      email: string
    }
  }>
  budgets: Array<{
    id: string
    name: string
    amount: number
    spent: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  }>
}

export default function Projects() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
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
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      setLoading(true)
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id))
      } else {
        setError('Erro ao excluir projeto')
      }
    } catch (error) {
      console.error('Erro ao excluir projeto:', error)
      setError('Erro ao excluir projeto')
    }
  }

  const currentUser = session?.user
  const isPageLoading = status === 'loading'

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter(project => project.status === 'ACTIVE').length
  const totalBudgets = projects.reduce((sum, project) => sum + (project.budgets?.length || 0), 0)
  const totalAmount = projects.reduce((sum, project) => 
    sum + (project.budgets?.reduce((budgetSum, budget) => budgetSum + budget.amount, 0) || 0), 0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
              <p className="text-gray-600 mt-1">Gerencie seus projetos e organize seus orçamentos</p>
            </div>
            <button 
              onClick={() => router.push('/projects/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Novo Projeto
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total de Projetos</div>
              <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Projetos Ativos</div>
              <div className="text-2xl font-bold text-green-600">{activeProjects}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total de Orçamentos</div>
              <div className="text-2xl font-bold text-gray-900">{totalBudgets}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Valor Total</div>
              <div className="text-2xl font-bold text-gray-900">R$ {totalAmount.toLocaleString('pt-BR')}</div>
            </div>
          </div>

          {/* Lista de Projetos */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Projetos</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Carregando projetos...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={fetchProjects}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
                  <p className="text-gray-500 mb-4">Comece criando seu primeiro projeto.</p>
                  <button 
                    onClick={() => router.push('/projects/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Criar Projeto
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            project.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status === 'ACTIVE' ? 'Ativo' :
                             project.status === 'INACTIVE' ? 'Inativo' : 'Arquivado'}
                          </span>
                        </div>

                        <div className="space-y-3">
                                                     <div className="flex justify-between text-sm">
                             <span className="text-gray-500">Orçamentos:</span>
                             <span className="font-medium">{project.budgets?.length || 0}</span>
                           </div>
                           
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-500">Membros:</span>
                             <span className="font-medium">{project.members?.length || 0}</span>
                           </div>

                          <div className="text-xs text-gray-500">
                            Criado em {formatDate(new Date(project.createdAt))}
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => router.push(`/projects/${project.id}`)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Ver detalhes
                          </button>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/projects/${project.id}/edit`)}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
