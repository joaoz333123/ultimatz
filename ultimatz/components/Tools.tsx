'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

export default function Tools() {
  const tools = [
    {
      name: 'AppFin',
      description: 'Sistema inteligente de gestão financeira com IA',
      benefit: 'Redução de 70% no tempo de aprovações',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      href: '/appfin'
    },
    {
      name: 'SGF-Obras',
      description: 'Sistema financeiro de obras que substitui planilhas/WhatsApp',
      benefit: 'R$ 60k/ano economia por cliente',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      href: '/contato'
    },
    {
      name: 'PGM',
      description: 'Aplicativo web de gestão de manutenção preditiva',
      benefit: '16h → 10min controle, R$ 110k/ano economia',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      href: '/contato'
    },
    {
      name: 'GIP',
      description: 'Plataforma pericial que centraliza processos',
      benefit: '90% redução tempo administrativo, R$ 60k/ano',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      href: '/contato'
    }
  ]

  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Ferramentas Digitais
            <span className="block text-secondary">Personalizadas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desenvolvidas com IA para adaptar-se ao seu processo específico, 
            resolvendo problemas reais de gestão e manutenção.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group"
            >
              <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} text-white`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <p className="text-sm font-semibold text-secondary">
                        {tool.benefit}
                      </p>
                    </div>
                    <Link href={tool.href}>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white group-hover:bg-secondary transition-all duration-300"
                      >
                        {tool.href === '/appfin' ? 'Acessar AppFin' : 'Ver Demo'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Quer ver todas as ferramentas em ação?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Agende uma demonstração personalizada e descubra como nossas ferramentas 
              podem resolver os desafios específicos da sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold"
                >
                  Agendar Demo Personalizada
                </Button>
              </Link>
              <Link href="/ferramentas">
                <Button 
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  Ver Todas as Ferramentas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 