import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()
    const userId = (session?.user as any)?.id
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const budgetId = formData.get('budgetId') as string | null
    if (!file || !budgetId) return NextResponse.json({ error: 'Arquivo e budgetId são obrigatórios' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(uploadDir, filename)
    await fs.writeFile(filepath, buffer)

    const created = await prisma.document.create({
      data: {
        budgetId,
        name: file.name,
        type: 'OTHER',
        size: buffer.length,
        url: `/uploads/${filename}`,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


