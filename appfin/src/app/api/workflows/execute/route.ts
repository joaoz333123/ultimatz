import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const executeWorkflowSchema = z.object({
  budgetId: z.string(),
  workflowId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parse = executeWorkflowSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0]?.message ?? 'Dados inválidos' }, { status: 400 })
    }

    const { budgetId, workflowId } = parse.data

    // Verificar se o budget existe
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        project: true,
      },
    })

    if (!budget) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    // Verificar se o workflow existe e está ativo
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
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
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow não encontrado' }, { status: 404 })
    }

    if (!workflow.isActive) {
      return NextResponse.json({ error: 'Workflow não está ativo' }, { status: 400 })
    }

    // Verificar se já existe uma instância para este budget
    const existingInstance = await prisma.workflowInstance.findFirst({
      where: {
        budgetId,
        workflowId,
        status: {
          in: ['PENDING', 'IN_PROGRESS'],
        },
      },
    })

    if (existingInstance) {
      return NextResponse.json({ error: 'Já existe uma instância ativa para este orçamento' }, { status: 400 })
    }

    // Criar instância do workflow
    const workflowInstance = await prisma.workflowInstance.create({
      data: {
        budgetId,
        workflowId,
        currentStep: 1,
        status: 'PENDING',
      },
      include: {
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
        budget: {
          include: {
            project: true,
            user: true,
          },
        },
      },
    })

    // Processar primeiro step
    const firstStep = workflow.steps[0]
    if (firstStep && firstStep.type === 'APPROVER' && firstStep.approverId) {
      // Criar aprovação para o primeiro aprovador
      await prisma.approval.create({
        data: {
          budgetId,
          userId: firstStep.approverId,
          status: 'PENDING',
          comment: `Aprovação automática do workflow: ${workflow.name}`,
        },
      })

      // Atualizar status da instância
      await prisma.workflowInstance.update({
        where: { id: workflowInstance.id },
        data: { status: 'IN_PROGRESS' },
      })
    }

    return NextResponse.json({
      success: true,
      instance: workflowInstance,
      message: 'Workflow iniciado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao executar workflow:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
