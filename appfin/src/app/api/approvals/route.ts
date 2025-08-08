import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'pending'
    const status = searchParams.get('status')

    let whereClause: any = {
      userId,
    }

    if (filter === 'pending') {
      whereClause.status = 'PENDING'
    } else if (status) {
      whereClause.status = status
    }

    const approvals = await prisma.approval.findMany({
      where: whereClause,
      include: {
        budget: {
          include: {
            project: true,
            user: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(approvals)
  } catch (error) {
    console.error('Erro ao buscar aprovações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { budgetId, approverId, comment } = await request.json()

    if (!budgetId || !approverId) {
      return NextResponse.json({ error: 'Dados obrigatórios não fornecidos' }, { status: 400 })
    }

    const approval = await prisma.approval.create({
      data: {
        budgetId,
        userId: approverId,
        status: 'PENDING',
        comment,
      },
      include: {
        budget: {
          include: {
            project: true,
            user: true,
          },
        },
        user: true,
      },
    })

    return NextResponse.json(approval)
  } catch (error) {
    console.error('Erro ao criar aprovação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


