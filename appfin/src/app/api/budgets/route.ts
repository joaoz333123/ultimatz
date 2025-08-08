import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { budgetSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getAuthSession()
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId: userId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
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

    const body = await request.json()
    const parse = budgetSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0]?.message ?? 'Dados inválidos' }, { status: 400 })
    }
    const { projectId, name, description, amount } = parse.data

    // Verificar se o projeto pertence ao usuário
    const membership = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: { some: { userId } },
      },
      select: { id: true },
    })
    if (!membership) {
      return NextResponse.json({ error: 'Projeto inválido' }, { status: 403 })
    }

    const budget = await prisma.budget.create({
      data: {
        projectId,
        userId: userId,
        name,
        description,
        amount: amount,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Erro ao criar orçamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
