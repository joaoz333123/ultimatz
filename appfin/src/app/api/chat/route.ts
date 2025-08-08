import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { generateAdvancedContent } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'

// Função para ler dados do banco
async function readDatabaseData(userId: string) {
  try {
    // Acesso amplo para análise (sem filtro por usuário; single-empresa)
    const projects = await prisma.project.findMany({
      include: {
        members: { select: { id: true, role: true, userId: true } },
        budgets: { select: { id: true, name: true, amount: true, spent: true, status: true } },
      },
      take: 50,
    })

    const budgets = await prisma.budget.findMany({ include: { project: { select: { id: true, name: true } } }, take: 100 })

    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true }, take: 100 })

    return {
      projects,
      budgets,
      users,
      totalProjects: projects.length,
      totalBudgets: budgets.length,
      totalUsers: users.length
    }
  } catch (error) {
    console.error('Erro ao ler dados do banco:', error)
    return null
  }
}

// Função para executar comandos de escrita no banco
async function executeDatabaseWrite(command: string, userId: string) {
  try {
    const lowerCommand = command.toLowerCase()
    
    // Detectar criação de projeto com linguagem natural
    const featureWriteEnabled = process.env.CHAT_WRITE_ENABLED === 'true' || process.env.CHAT_WRITE_ENABLED === undefined
    if (!featureWriteEnabled) {
      return null
    }

    if (lowerCommand.includes('projeto') && (
        lowerCommand.includes('criar') || 
        lowerCommand.includes('crie') ||
        lowerCommand.includes('faça') ||
        lowerCommand.includes('quero') ||
        lowerCommand.includes('preciso') ||
        lowerCommand.includes('novo'))) {
      
      // Extrair nome do projeto de forma mais natural
      const projectName = extractProjectNameNatural(command)
      
      const newProject = await prisma.project.create({
        data: {
          name: projectName,
          description: 'Projeto criado via IA',
          status: 'ACTIVE'
        }
      })
      
      return `✅ Projeto "${newProject.name}" criado com sucesso! ID: ${newProject.id}`
    }
    
    // Detectar criação de workflow simples
    if (lowerCommand.includes('workflow') && (
        lowerCommand.includes('criar') || 
        lowerCommand.includes('crie') ||
        lowerCommand.includes('faça') ||
        lowerCommand.includes('novo'))) {
      const wf = await prisma.workflow.create({
        data: { name: 'Workflow Padrão', description: 'Criado via chat', isActive: true },
      })
      await prisma.workflowStep.create({ data: { workflowId: wf.id, stepNumber: 1, name: 'Início', type: 'START', isRequired: true, timeoutDays: 0 } })
      await prisma.workflowStep.create({ data: { workflowId: wf.id, stepNumber: 2, name: 'Aprovador', type: 'APPROVER', approverId: userId, isRequired: true, timeoutDays: 2 } })
      await prisma.workflowStep.create({ data: { workflowId: wf.id, stepNumber: 3, name: 'Fim', type: 'END', isRequired: true, timeoutDays: 0 } })
      return `✅ Workflow "${wf.name}" criado com 3 etapas.`
    }

    // Detectar criação de orçamento com linguagem natural
    if (lowerCommand.includes('orçamento') && (
        lowerCommand.includes('criar') || 
        lowerCommand.includes('crie') ||
        lowerCommand.includes('faça') ||
        lowerCommand.includes('quero') ||
        lowerCommand.includes('preciso') ||
        lowerCommand.includes('novo'))) {
      
      const budgetName = extractBudgetNameNatural(command)
      const budgetAmount = extractBudgetAmountNatural(command)
      // Tentar identificar projeto
      let projectName: string | null = null
      const matchPara = command.match(/para\s+([^,\n\.]+)/i)
      if (matchPara && matchPara[1]) projectName = matchPara[1].trim()
      if (!projectName) projectName = extractProjectNameNatural(command)

      let project = null as null | { id: string; name: string }
      if (projectName) {
        project = await prisma.project.findFirst({ where: { name: projectName } })
        if (!project) {
          const created = await prisma.project.create({ data: { name: projectName, description: 'Projeto criado via chat', status: 'ACTIVE' } })
          project = { id: created.id, name: created.name }
        }
      } else {
        const found = await prisma.project.findFirst({ orderBy: { createdAt: 'desc' } })
        if (found) project = { id: found.id, name: found.name }
        if (!project) {
          const created = await prisma.project.create({ data: { name: 'Projeto Padrão', status: 'ACTIVE' } })
          project = { id: created.id, name: created.name }
        }
      }

      const newBudget = await prisma.budget.create({
        data: {
          name: budgetName,
          amount: budgetAmount,
          spent: 0,
          status: 'PENDING',
          projectId: project!.id,
          userId: userId
        }
      })
      // Instanciar último workflow ativo e criar aprovações iniciais
      const latestWf = await prisma.workflow.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        include: { steps: { orderBy: { stepNumber: 'asc' } } },
      })
      if (latestWf) {
        await prisma.workflowInstance.create({
          data: { budgetId: newBudget.id, workflowId: latestWf.id, status: 'PENDING', currentStep: 1 },
        })
        const firstSteps = latestWf.steps.filter(s => s.stepNumber === 1 && s.type === 'APPROVER')
        for (const s of firstSteps) {
          if (s.approverId) {
            await prisma.approval.create({ data: { budgetId: newBudget.id, userId: s.approverId, status: 'PENDING' } })
          }
        }
      }
      
      return `✅ Orçamento "${newBudget.name}" criado no projeto "${project!.name}". Valor: R$ ${newBudget.amount.toFixed(2)}${latestWf ? ' • Workflow iniciado' : ''}`
    }
    
    // Se não for um comando de escrita, retornar null para deixar o Gemini responder
    return null
  } catch (error) {
    console.error('Erro ao executar comando de escrita:', error)
    return `❌ Erro ao executar comando: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
  }
}

// Funções auxiliares para extrair informações com linguagem natural
function extractProjectNameNatural(command: string): string {
  // Padrões para extrair nome do projeto
  const patterns = [
    /(?:criar|crie|faça|quero|preciso|novo).*?projeto.*?(?:chamado|com nome|de|para)\s+([^,\n\.]+)/i,
    /(?:projeto|projeto)\s+(?:chamado|com nome|de)\s+([^,\n\.]+)/i,
    /(?:nome|chamado)\s+([^,\n\.]+)/i,
    /(?:projeto|projeto)\s+([^,\n\.]+)/i
  ]
  
  for (const pattern of patterns) {
    const match = command.match(pattern)
    if (match) {
      const name = match[1].trim()
      if (name && name.length > 0) {
        return name
      }
    }
  }
  
  // Se não encontrar, usar palavras após "projeto"
  const words = command.split(/\s+/)
  const projetoIndex = words.findIndex(word => word.toLowerCase().includes('projeto'))
  if (projetoIndex !== -1 && projetoIndex + 1 < words.length) {
    return words[projetoIndex + 1]
  }
  
  return 'Novo Projeto'
}

function extractBudgetNameNatural(command: string): string {
  // Padrões para extrair nome do orçamento
  const patterns = [
    /(?:criar|crie|faça|quero|preciso|novo).*?orçamento.*?(?:chamado|com nome|de|para)\s+([^,\n\.]+)/i,
    /(?:orçamento|orçamento)\s+(?:chamado|com nome|de)\s+([^,\n\.]+)/i,
    /(?:nome|chamado)\s+([^,\n\.]+)/i,
    /(?:orçamento|orçamento)\s+([^,\n\.]+)/i
  ]
  
  for (const pattern of patterns) {
    const match = command.match(pattern)
    if (match) {
      const name = match[1].trim()
      if (name && name.length > 0) {
        return name
      }
    }
  }
  
  // Se não encontrar, usar palavras após "orçamento"
  const words = command.split(/\s+/)
  const orcamentoIndex = words.findIndex(word => word.toLowerCase().includes('orçamento'))
  if (orcamentoIndex !== -1 && orcamentoIndex + 1 < words.length) {
    return words[orcamentoIndex + 1]
  }
  
  return 'Novo Orçamento'
}

function extractBudgetAmountNatural(command: string): number {
  const patterns = [
    /(?:valor|quantia|preço|custo|de)\s*R?\$?\s*([0-9,]+\.?[0-9]*)/i,
    /R?\$?\s*([0-9,]+\.?[0-9]*)/i,
    /(?:por|de)\s+R?\$?\s*([0-9,]+\.?[0-9]*)/i
  ]
  
  for (const pattern of patterns) {
    const match = command.match(pattern)
    if (match) {
      const amount = parseFloat(match[1].replace(',', '.'))
      if (!isNaN(amount) && amount > 0) {
        return amount
      }
    }
  }
  
  return 1000 // Valor padrão
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { message, thinkingMode = true, searchWeb = true } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    // Verificar se a API key está configurada
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'API do Gemini não configurada. Configure GEMINI_API_KEY no arquivo .env' 
      }, { status: 500 })
    }

    // Verificar se o usuário tem ID
    const userId = (session.user as any).id || session.user.email
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não identificado' }, { status: 401 })
    }

    // Ler dados do banco
    const dbData = await readDatabaseData(userId)
    
    // Verificar se é um comando de escrita
    const lowerMessage = message.toLowerCase()
    const isWriteCommand = (lowerMessage.includes('projeto') || lowerMessage.includes('orçamento')) && (
        lowerMessage.includes('criar') || 
        lowerMessage.includes('crie') ||
        lowerMessage.includes('faça') ||
        lowerMessage.includes('quero') ||
        lowerMessage.includes('preciso') ||
        lowerMessage.includes('novo'))

    if (isWriteCommand) {
      // Executar comando de escrita
      const writeResult = await executeDatabaseWrite(message, userId)
      if (writeResult) { // Se for um comando de escrita, retornar o resultado
        return NextResponse.json({ response: writeResult })
      }
      // Se não retornou resultado, continuar com o Gemini
    }

    // Prompt com acesso ao banco de dados
    const prompt = `Você é um assistente IA com acesso ao banco de dados do AppFin e pode pesquisar na web quando necessário.

DADOS DO BANCO DE DADOS:
${dbData ? `
PROJETOS (${dbData.totalProjects}):
${dbData.projects.map(project => `
- ID: ${project.id}
- Nome: ${project.name}
- Descrição: ${project.description || 'Sem descrição'}
- Status: ${project.status}
- Membros: ${project.members.length}
- Orçamentos: ${project.budgets.length}
`).join('')}

ORÇAMENTOS (${dbData.totalBudgets}):
${dbData.budgets.map(budget => `
- ID: ${budget.id}
- Nome: ${budget.name}
- Projeto: ${budget.project?.name || 'Sem projeto'}
- Valor: R$ ${budget.amount.toFixed(2)}
- Gasto: R$ ${budget.spent.toFixed(2)}
- Status: ${budget.status}
`).join('')}

USUÁRIOS (${dbData.totalUsers}):
${dbData.users.map(user => `
- ID: ${user.id}
- Nome: ${user.name}
- Email: ${user.email}
`).join('')}
` : 'Nenhum dado disponível no banco.'}

CAPACIDADES:
- Ler todos os dados do banco
- Criar novos projetos e orçamentos
- Analisar dados financeiros
- Fornecer insights baseados nos dados

COMO CRIAR PROJETOS E ORÇAMENTOS:
Se o usuário quiser criar algo, você pode:
1. Criar projetos: "crie um projeto chamado [nome]" ou "quero criar um projeto"
2. Criar orçamentos: "faça um orçamento de [valor] para [nome]" ou "preciso de um orçamento"
3. Responder perguntas sobre o que é necessário para criar
4. Sugerir nomes e valores apropriados

EXEMPLOS DE LINGUAGEM NATURAL:
- "crie um projeto chamado ABACAXI"
- "quero criar um projeto para vendas"
- "faça um orçamento de R$ 5000 para marketing"
- "preciso de um orçamento para publicidade"

INSTRUÇÕES:
1. Use os dados do banco para responder perguntas
2. Se o usuário quiser criar algo, sugira como fazer
3. Forneça análises detalhadas dos dados
4. Responda sempre em português brasileiro
5. Use thinking mode para análises complexas
6. Seja útil e amigável

PERGUNTA DO USUÁRIO: ${message}

RESPONDA BASEADO NOS DADOS DO BANCO:`

    try {
      // Usar função avançada com thinking mode
      const aiResponse = await generateAdvancedContent(prompt, {
        useThinkingMode: thinkingMode,
        searchWeb: searchWeb, // pesquisa web habilitada por padrão
        maxTokens: 8192
      })

      if (!aiResponse) {
        throw new Error('Falha ao gerar resposta')
      }

      // Persistir mensagem do usuário e resposta da IA
      const created = await prisma.chat.create({
        data: {
          userId,
          message,
          response: aiResponse,
        },
      })

      return NextResponse.json({ response: aiResponse, id: created.id })
    } catch (geminiError) {
      console.error('Erro específico do Gemini:', geminiError)
      
      return NextResponse.json({ 
        error: 'Erro ao processar mensagem com IA. Tente novamente.' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Erro geral no chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
