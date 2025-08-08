'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'

interface ChatMessage {
  id: string
  type: 'user' | 'ai' | 'thinking'
  content: string
  timestamp: Date
}

export default function Chat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados para thinking mode
  const [thinkingMode, setThinkingMode] = useState(true)
  const [showThinkingText, setShowThinkingText] = useState(true)
  const [webSearch, setWebSearch] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Carregar histórico ao iniciar
  useEffect(() => {
    const loadHistory = async () => {
      if (!session?.user) return
      try {
        const res = await fetch('/api/chat/history')
        if (res.ok) {
          const data = await res.json()
          const normalized: ChatMessage[] = (data.messages ?? []).map((m: { id: string; type: 'user'|'ai'|'thinking'; content: string; timestamp: string }) => ({
            id: m.id,
            type: m.type,
            content: m.content,
            timestamp: new Date(m.timestamp),
          }))
          setMessages(normalized)
        }
      } catch (e) {
        // silencioso
      }
    }
    loadHistory()
  }, [session?.user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    // Adicionar mensagem de thinking se estiver ativado
    if (thinkingMode) {
      const thinkingMessage: ChatMessage = {
        id: (Date.now() + 0.5).toString(),
        type: 'thinking',
        content: '[THINKING MODE ATIVADO]\n\nAnalisando profundamente o assunto...\nConsiderando múltiplas perspectivas...\nProcessando informações de forma crítica...\nFornecendo insights detalhados...',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, thinkingMessage])
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.content,
          thinkingMode: thinkingMode,
          searchWeb: webSearch
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Erro: ${data.error || 'Erro desconhecido'}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Erro ao conectar com o servidor',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMessageStyle = (type: 'user' | 'ai' | 'thinking') => {
    switch (type) {
      case 'user':
        return 'bg-blue-600 text-white'
      case 'ai':
        return 'bg-gray-200 text-gray-800'
      case 'thinking':
        return 'bg-gray-100 text-gray-600 border-l-4 border-blue-400'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  const getMessageTextStyle = (type: 'user' | 'ai' | 'thinking') => {
    switch (type) {
      case 'user':
        return 'text-sm'
      case 'ai':
        return 'text-sm'
      case 'thinking':
        return 'text-xs font-mono'
      default:
        return 'text-sm'
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold">🤖 Chat IA Livre</h1>
            <p className="text-blue-100 mt-2">
              Pergunte qualquer coisa - sem restrições!
            </p>
          </div>

          {/* Controles de Thinking Mode */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Toggle Thinking Mode */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Thinking Mode:</span>
                  <button
                    onClick={() => setThinkingMode(!thinkingMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      thinkingMode ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        thinkingMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle Web Search */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Pesquisa Web:</span>
                  <button
                    onClick={() => setWebSearch(!webSearch)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      webSearch ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        webSearch ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle Show Thinking Text */}
                {thinkingMode && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Mostrar texto:</span>
                    <button
                      onClick={() => setShowThinkingText(!showThinkingText)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThinkingText ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThinkingText ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {thinkingMode ? 'Thinking Mode Ativado' : 'Thinking Mode Desativado'}
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              // Ocultar mensagens de thinking se configurado
              if (msg.type === 'thinking' && !showThinkingText) {
                return null
              }

              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getMessageStyle(msg.type)}`}
                  >
                    <p className={`whitespace-pre-wrap ${getMessageTextStyle(msg.type)}`}>
                      {msg.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">🤔</div>
                    <span className="text-sm">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pergunte qualquer coisa..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
