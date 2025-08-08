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
    const status = searchParams.get('status')
    const budgetId = searchParams.get('budgetId')

    let whereClause: any = {}

    if (status) {
      whereClause.status = status
    }

    if (budgetId) {
      whereClause.budgetId = budgetId
    }

    const instances = await prisma.workflowInstance.findMany({
      where: whereClause,
      include: {
        budget: {
          include: {
            project: true,
            user: true,
          },
        },
        workflow: {
          include: {
            steps: {
              orderBy: {
                stepNumber: 'asc',
              },
              include: {
                approver: true,
              },
            },
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    })

    return NextResponse.json(instances)
  } catch (error) {
    console.error('Erro ao buscar instâncias de workflow:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
