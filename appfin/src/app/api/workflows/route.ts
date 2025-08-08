import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const stepSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['START', 'APPROVER', 'CONDITION', 'ACTION', 'END']),
  approverId: z.string().optional(),
  approverType: z.enum(['USER', 'ROLE', 'DEPARTMENT']).optional(),
  isRequired: z.boolean().optional(),
  timeoutDays: z.number().int().min(0).optional(),
  conditions: z.string().optional(),
})
const workflowCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(stepSchema).optional(),
})

export async function GET() {
  try {
    const session = await getAuthSession()
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const workflows = await prisma.workflow.findMany({
      include: {
        steps: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Erro ao buscar workflows:', error)
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
    const parse = workflowCreateSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0]?.message ?? 'Dados inválidos' }, { status: 400 })
    }
    const { name, description, steps } = parse.data

    // Criar workflow
    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        isActive: true,
      },
    })

    // Criar steps
    if (steps && Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        await prisma.workflowStep.create({
          data: {
            workflowId: workflow.id,
            stepNumber: i + 1,
            name: step.name,
            type: step.type,
            approverId: step.approverId,
            approverType: step.approverType,
            isRequired: step.isRequired !== false,
            timeoutDays: step.timeoutDays || 0,
            conditions: step.conditions,
          },
        })
      }
    }

    // Retornar workflow com steps
    const createdWorkflow = await prisma.workflow.findUnique({
      where: { id: workflow.id },
      include: {
        steps: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
      },
    })

    return NextResponse.json(createdWorkflow)
  } catch (error) {
    console.error('Erro ao criar workflow:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
