import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const templates = [
  {
    name: 'Aprovação Simples',
    description: 'Aprovação direta por um gerente',
    steps: [
      {
        stepNumber: 1,
        name: 'Início',
        type: 'START',
        isRequired: true,
        timeoutDays: 0,
      },
      {
        stepNumber: 2,
        name: 'Aprovação do Gerente',
        type: 'APPROVER',
        isRequired: true,
        timeoutDays: 3,
      },
      {
        stepNumber: 3,
        name: 'Finalização',
        type: 'END',
        isRequired: true,
        timeoutDays: 0,
      },
    ],
  },
  {
    name: 'Aprovação Dupla',
    description: 'Aprovação por gerente e diretor',
    steps: [
      {
        stepNumber: 1,
        name: 'Início',
        type: 'START',
        isRequired: true,
        timeoutDays: 0,
      },
      {
        stepNumber: 2,
        name: 'Aprovação do Gerente',
        type: 'APPROVER',
        isRequired: true,
        timeoutDays: 3,
      },
      {
        stepNumber: 3,
        name: 'Aprovação do Diretor',
        type: 'APPROVER',
        isRequired: true,
        timeoutDays: 5,
      },
      {
        stepNumber: 4,
        name: 'Finalização',
        type: 'END',
        isRequired: true,
        timeoutDays: 0,
      },
    ],
  },
  {
    name: 'Aprovação Tripla',
    description: 'Aprovação por gerente, diretor e CFO',
    steps: [
      {
        stepNumber: 1,
        name: 'Início',
        type: 'START',
        isRequired: true,
        timeoutDays: 0,
      },
      {
        stepNumber: 2,
        name: 'Aprovação do Gerente',
        type: 'APPROVER',
        isRequired: true,
        timeoutDays: 3,
      },
      {
        stepNumber: 3,
        name: 'Aprovação do Diretor',
        type: 'APPROVER',
        isRequired: true,
        timeoutDays: 5,
      },
      {
        stepNumber: 4,
        name: 'Aprovação do CFO',
        type: 'APPROVER',
        isRequired: true,
        timeoutDays: 7,
      },
      {
        stepNumber: 5,
        name: 'Finalização',
        type: 'END',
        isRequired: true,
        timeoutDays: 0,
      },
    ],
  },
]

export async function GET() {
  try {
    const session = await getAuthSession()
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Erro ao buscar templates:', error)
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

    const { templateName, customName, approverIds } = await request.json()

    if (!templateName || !customName || !approverIds || !Array.isArray(approverIds)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const template = templates.find(t => t.name === templateName)
    if (!template) {
      return NextResponse.json({ error: 'Template não encontrado' }, { status: 404 })
    }

    // Criar workflow baseado no template
    const workflow = await prisma.workflow.create({
      data: {
        name: customName,
        description: template.description,
        isActive: true,
      },
    })

    // Criar steps com os aprovadores fornecidos
    for (let i = 0; i < template.steps.length; i++) {
      const step = template.steps[i]
      const approverId = step.type === 'APPROVER' ? approverIds[i - 1] : null

      await prisma.workflowStep.create({
        data: {
          workflowId: workflow.id,
          stepNumber: step.stepNumber,
          name: step.name,
          type: step.type,
          approverId,
          approverType: approverId ? 'USER' : null,
          isRequired: step.isRequired,
          timeoutDays: step.timeoutDays,
        },
      })
    }

    // Retornar workflow criado
    const createdWorkflow = await prisma.workflow.findUnique({
      where: { id: workflow.id },
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

    return NextResponse.json(createdWorkflow)
  } catch (error) {
    console.error('Erro ao criar workflow do template:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
