import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getAuthSession()
    
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
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
        budgets: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
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
    const parse = projectSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0]?.message ?? 'Dados inválidos' }, { status: 400 })
    }
    const { name, description } = parse.data

    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: userId,
            role: 'OWNER',
          },
        },
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
