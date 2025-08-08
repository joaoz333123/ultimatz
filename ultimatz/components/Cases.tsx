'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Clock, FileText, Building2 } from 'lucide-react'
import Link from 'next/link'

export default function Cases() {
  const cases = [
    {
      title: 'SGF-Obras - Shopping Center',
      description: 'Implementação do sistema financeiro de obras em shopping com 200+ lojas',
      problem: 'Gestão de obras dispersa em planilhas e WhatsApp',
      solution: 'Sistema centralizado com aprovações automáticas e relatórios em tempo real',
      results: [
        'R$ 60k/ano economia em gestão',
        '90% redução no tempo de aprovação',
        'Controle total de orçamentos'
      ],
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      delay: 0.2
    },
    {
      title: 'PGM - Aeroporto Regional',
      description: 'Sistema de manutenção preditiva para equipamentos críticos',
      problem: 'Controle manual de 16h por equipamento',
      solution: 'Aplicativo web com IA para predição de falhas',
      results: [
        '16h → 10min controle por equipamento',
        'R$ 110k/ano economia em manutenção',
        'Zero paradas não programadas'
      ],
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      delay: 0.4
    },
    {
      title: 'GIP - Escritório de Advocacia',
      description: 'Plataforma pericial para processos judiciais complexos',
      problem: 'Processos administrativos consumindo 90% do tempo',
      solution: 'Sistema centralizado com templates inteligentes',
      results: [
        '90% redução tempo administrativo',
        'R$ 60k/ano economia em produtividade',
        'Laudos 3x mais rápidos'
      ],
      icon: FileText,
      color: 'from-green-500 to-green-600',
      delay: 0.6
    },
    {
      title: 'Consultoria - Retrofit HVAC',
      description: 'Projeto de retrofit multimilionário em shopping premium',
      problem: 'Incerteza em investimento de R$ 6M',
      solution: 'Planejamento detalhado com ROI garantido',
      results: [
        '25% redução custos operacionais',
        'ROI de 18 meses',
        'Projeto R$ 6M entregue no prazo'
      ],
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      delay: 0.8
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Cases de
            <span className="block text-secondary">Sucesso</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resultados comprovados que transformaram desafios complexos 
            em economia real e eficiência operacional.
          </p>
        </div>

        {/* Cases Grid */}
        <div className="space-y-12">
          {cases.map((caseItem, index) => (
            <div
              key={caseItem.title}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${caseItem.color} text-white`}>
                    <caseItem.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{caseItem.title}</h3>
                </div>
                
                <p className="text-lg text-muted-foreground">{caseItem.description}</p>
                
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-red-700 mb-2">Problema</h4>
                    <p className="text-red-600">{caseItem.problem}</p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Solução</h4>
                    <p className="text-blue-600">{caseItem.solution}</p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-green-700 mb-2">Resultados</h4>
                    <ul className="text-green-600 space-y-1">
                      {caseItem.results.map((result, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Link href="/contato">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Solicitar Case Similar
                  </Button>
                </Link>
              </div>

              {/* Visual Card */}
              <div className="flex-1">
                <Card className="h-full border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-primary">
                      Resumo do Projeto
                    </CardTitle>
                    <CardDescription className="text-base">
                      {caseItem.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-accent rounded-lg">
                          <div className="text-2xl font-bold text-primary">R$ 230k</div>
                          <div className="text-sm text-muted-foreground">Economia Total</div>
                        </div>
                        <div className="text-center p-4 bg-accent rounded-lg">
                          <div className="text-2xl font-bold text-secondary">90%</div>
                          <div className="text-sm text-muted-foreground">Eficiência</div>
                        </div>
                      </div>
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <p className="text-sm font-semibold text-secondary text-center">
                          Projeto entregue no prazo e dentro do orçamento
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Quer resultados similares para sua empresa?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Nossas ferramentas e consultoria podem transformar seus desafios 
              em economia real e eficiência operacional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button 
                  className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold"
                >
                  Agendar Consultoria
                </Button>
              </Link>
              <Link href="/ferramentas">
                <Button 
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
                >
                  Ver Ferramentas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 