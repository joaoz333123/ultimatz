import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = (searchParams.get('format') || 'csv').toLowerCase()

    const budgets = await prisma.budget.findMany({
      include: { project: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    })

    if (format === 'csv') {
      const headers = ['id','name','project','amount','spent','status','createdAt']
      const rows = budgets.map(b => [
        b.id,
        b.name,
        b.project?.name ?? '',
        b.amount.toString().replace('.', ','),
        b.spent.toString().replace('.', ','),
        b.status,
        b.createdAt.toISOString(),
      ])
      const csv = [headers.join(';'), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(';'))].join('\n')
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="budgets.csv"',
        },
      })
    }

    return NextResponse.json({ error: 'Formato não suportado' }, { status: 400 })
  } catch (error) {
    console.error('Erro ao exportar budgets:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


