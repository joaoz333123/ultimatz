'use client'

import { useSession } from 'next-auth/react'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import BudgetList from '@/components/budgets/BudgetList'
import { formatCurrency } from '@/lib/utils'

interface Budget {
  id: string
  name: string
  description?: string
  amount: number
  spent: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
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

export default function Budgets() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchBudgets()
    }
  }, [session])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/budgets')
      if (response.ok) {
        const data = await response.json()
        setBudgets(data)
      } else {
        setError('Erro ao carregar orçamentos')
      }
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error)
      setError('Erro ao carregar orçamentos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) {
      return
    }

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBudgets(budgets.filter(budget => budget.id !== id))
      } else {
        setError('Erro ao excluir orçamento')
      }
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
      setError('Erro ao excluir orçamento')
    }
  }

  const isPageLoading = status === 'loading'

  const filtered = budgets.filter(b => {
    const okStatus = filterStatus === 'ALL' || b.status === filterStatus
    const term = search.toLowerCase()
    const okTerm = !term || b.name.toLowerCase().includes(term) || b.project.name.toLowerCase().includes(term)
    return okStatus && okTerm
  })

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const totalBudgets = budgets.length
  const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const pendingBudgets = budgets.filter(budget => budget.status === 'PENDING').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
              <p className="text-gray-600 mt-1">Gerencie seus orçamentos e acompanhe os gastos</p>
            </div>
            <button 
              onClick={() => router.push('/budgets/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Novo Orçamento
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total de Orçamentos</div>
              <div className="text-2xl font-bold text-gray-900">{totalBudgets}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Valor Total</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total Gasto</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Pendentes</div>
              <div className="text-2xl font-bold text-yellow-600">{pendingBudgets}</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center gap-3">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nome ou projeto" className="flex-1 border rounded px-3 py-2" />
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="border rounded px-3 py-2">
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendente</option>
              <option value="APPROVED">Aprovado</option>
              <option value="REJECTED">Rejeitado</option>
              <option value="COMPLETED">Concluído</option>
            </select>
          </div>

          {/* Lista de Orçamentos */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Orçamentos</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Carregando orçamentos...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={fetchBudgets}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : (
                <BudgetList budgets={filtered} onDelete={handleDelete} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
