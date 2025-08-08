'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut()
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              AppFin
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/projects" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/projects') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Projetos
            </Link>
            <Link 
              href="/budgets" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/budgets') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Orçamentos
            </Link>
            <Link 
              href="/workflows" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/workflows') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Workflows
            </Link>
            <Link 
              href="/chat" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/chat') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Chat IA
            </Link>
            <Link 
              href="/approvals" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/approvals') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Aprovações
            </Link>
            
            {session?.user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300">
                <span className="text-gray-700 text-sm">{session.user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
