import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Configurar Gemini 2.5 Flash com configurações avançadas
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 64,
    topP: 0.9,
    maxOutputTokens: 8192,
  },
})

// Função para gerar conteúdo com configurações avançadas
export async function generateAdvancedContent(prompt: string, options?: {
  useThinkingMode?: boolean,
  searchWeb?: boolean,
  urlContext?: string,
  maxTokens?: number
}) {
  try {
    let enhancedPrompt = prompt
    
    // Adicionar instruções de thinking mode se solicitado
    if (options?.useThinkingMode) {
      enhancedPrompt = `[THINKING MODE ATIVADO]
      
${prompt}

INSTRUÇÕES DE THINKING:
- Analise profundamente o assunto
- Considere múltiplas perspectivas
- Processe informações de forma crítica
- Forneça insights detalhados`
    }
    
    // Adicionar contexto de URL se fornecido
    if (options?.urlContext) {
      enhancedPrompt = `${enhancedPrompt}

CONTEXTO DE URL: ${options.urlContext}
Analise o conteúdo desta URL e incorpore as informações relevantes na resposta.`
    }
    
    // Adicionar instruções de busca web se solicitado
    // Habilitar instrução de busca web quando solicitado
    if (options?.searchWeb) {
      enhancedPrompt = `${enhancedPrompt}

[PESQUISA NA WEB ATIVADA]
Se necessário, pesquise na web (fontes confiáveis) e incorpore dados atuais, citando a fonte no texto.`
    }
    
    const result = await geminiModel.generateContent(enhancedPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Erro ao gerar conteúdo avançado:', error)
    return null
  }
}

// Função específica para análise de dados do banco
export async function analyzeDatabaseData(data: unknown, question: string) {
  try {
    const prompt = `Você é um analista de dados especializado em gestão financeira.

DADOS DISPONÍVEIS:
${JSON.stringify(data, null, 2)}

PERGUNTA DO USUÁRIO: ${question}

INSTRUÇÕES:
1. Analise os dados fornecidos
2. Forneça insights detalhados
3. Identifique padrões e tendências
4. Sugira melhorias baseadas nos dados
5. Responda sempre em português brasileiro
6. Use thinking mode para análises complexas

ANALISE OS DADOS E RESPONDA:`

    return await generateAdvancedContent(prompt, {
      useThinkingMode: true,
      searchWeb: false,
      maxTokens: 65536
    })
  } catch (error) {
    console.error('Erro ao analisar dados do banco:', error)
    return null
  }
}

export async function analyzeDocument(content: string) {
  try {
    const prompt = `Analise este documento financeiro e extraia as seguintes informações:
    - Valor total
    - Categoria da despesa
    - Data
    - Descrição
    - Status de aprovação
    
    Documento: ${content}
    
    Responda em formato JSON.`
    
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Erro ao analisar documento:', error)
    return null
  }
}

export async function generateReport(data: unknown) {
  try {
    const prompt = `Gere um relatório financeiro baseado nos seguintes dados:
    ${JSON.stringify(data)}
    
    Inclua:
    - Resumo executivo
    - Análise de gastos
    - Recomendações
    - Gráficos sugeridos`
    
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return null
  }
}

// Função para testar a conexão com a API
export async function testGeminiConnection() {
  try {
    const prompt = "Responda apenas 'OK' se estiver funcionando."
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text().trim() === 'OK'
  } catch (error) {
    console.error('Erro ao testar conexão Gemini:', error)
    return false
  }
}
