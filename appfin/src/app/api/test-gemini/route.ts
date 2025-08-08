import { NextRequest, NextResponse } from 'next/server'
import { testGeminiConnection } from '@/lib/gemini'

export async function GET(request: NextRequest) {
  try {
    // Verificar se a API key está configurada
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        status: 'error',
        message: 'API Key não configurada',
        details: 'Configure GEMINI_API_KEY no arquivo .env'
      }, { status: 500 })
    }

    // Testar conexão com Gemini
    const isConnected = await testGeminiConnection()
    
    if (isConnected) {
      return NextResponse.json({ 
        status: 'success',
        message: 'Gemini API funcionando corretamente',
        model: 'gemini-2.5-flash',
        features: [
          'Melhor preço/desempenho',
          'Capacidade de raciocínio',
          '1M tokens de entrada',
          '65K tokens de saída'
        ]
      })
    } else {
      return NextResponse.json({ 
        status: 'error',
        message: 'Falha na conexão com Gemini',
        details: 'Verifique a API key e a conectividade'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Erro ao testar Gemini:', error)
    return NextResponse.json({ 
      status: 'error',
      message: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
