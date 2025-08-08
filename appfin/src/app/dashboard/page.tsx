'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '@/components/Navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleCardClick = (route: string) => {
    router.push(route)
  }

  const isLoading = status === 'loading'

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bem-vindo ao AppFin, {session.user.name}!
              </h1>
              <p className="text-gray-600 mb-8">
                Sistema de Gestão Financeira Inteligente
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => handleCardClick('/projects')}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-blue-200"
                >
                  <h3 className="text-lg font-semibold mb-2 text-blue-600">📊 Projetos</h3>
                  <p className="text-gray-600">Gerencie seus projetos</p>
                  <p className="text-xs text-gray-400 mt-2">Clique para acessar</p>
                </div>
                <div 
                  onClick={() => handleCardClick('/budgets')}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-green-200"
                >
                  <h3 className="text-lg font-semibold mb-2 text-green-600">💰 Orçamentos</h3>
                  <p className="text-gray-600">Controle de orçamentos</p>
                  <p className="text-xs text-gray-400 mt-2">Clique para acessar</p>
                </div>
                <div 
                  onClick={() => handleCardClick('/workflows')}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
                >
                  <h3 className="text-lg font-semibold mb-2 text-purple-600">🚀 Workflows</h3>
                  <p className="text-gray-600">Esteira de aprovações</p>
                  <p className="text-xs text-gray-400 mt-2">Clique para acessar</p>
                </div>
                <div 
                  onClick={() => handleCardClick('/approvals')}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-yellow-200"
                >
                  <h3 className="text-lg font-semibold mb-2 text-yellow-600">✅ Aprovações</h3>
                  <p className="text-gray-600">Aprove ou rejeite pendências</p>
                  <p className="text-xs text-gray-400 mt-2">Clique para acessar</p>
                </div>
                <div 
                  onClick={() => handleCardClick('/chat')}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-orange-200"
                >
                  <h3 className="text-lg font-semibold mb-2 text-orange-600">🤖 Chat IA</h3>
                  <p className="text-gray-600">Análise inteligente</p>
                  <p className="text-xs text-gray-400 mt-2">Clique para acessar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
