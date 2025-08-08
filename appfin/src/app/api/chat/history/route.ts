import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o usuário tem ID
    const userId = (session.user as { id?: string; email?: string }).id || session.user.email
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não identificado' }, { status: 401 })
    }

    // Buscar histórico do chat do usuário
    const chatHistory = await prisma.chat.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 50 // Limitar a 50 mensagens mais recentes
    })

    // Converter para formato da interface
    const messages = chatHistory.map(chat => ({
      id: chat.id,
      type: chat.response ? 'ai' : 'user',
      content: chat.response || chat.message,
      timestamp: chat.createdAt.toISOString() // Converter para string ISO
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
