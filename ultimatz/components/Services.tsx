'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Building2, Settings, Gavel, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Services() {
  const services = [
    {
      title: 'Gestão de Projetos, Obras e Retrofit',
      description: 'Planejamento, execução e comissionamento de modernizações, focadas em eficiência energética e ROI.',
      benefits: [
        'Redução de 25% nos custos operacionais',
        'ROI garantido em 18 meses',
        'Projetos multimilionários entregues no prazo'
      ],
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      cta: 'Ver Projetos'
    },
    {
      title: 'Otimização de Operações',
      description: 'Auditoria de contratos, manutenção preditiva e projetos de eficiência energética para reduzir custos.',
      benefits: [
        'Redução de 30% nos custos de manutenção',
        'Zero paradas não programadas',
        'Contratos otimizados com economia garantida'
      ],
      icon: Settings,
      color: 'from-orange-500 to-orange-600',
      cta: 'Otimizar Operações'
    },
    {
      title: 'Perícia Técnica Judicial',
      description: 'Elaboração de laudos de alta complexidade com rigor normativo, servindo como base em disputas jurídicas.',
      benefits: [
        'Laudos com 100% de aprovação judicial',
        'Redução de 90% no tempo administrativo',
        'Especialização em HVAC e instalações'
      ],
      icon: Gavel,
      color: 'from-green-500 to-green-600',
      cta: 'Consultar Perícia'
    },
    {
      title: 'Gestão Estratégica de CAPEX',
      description: 'Planejamento e controle de investimentos em ativos complexos com previsibilidade de custo e prazo.',
      benefits: [
        'Previsibilidade de 95% em custos',
        'Controle total de investimentos',
        'ROI otimizado para cada projeto'
      ],
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      cta: 'Planejar CAPEX'
    }
  ]

  const credentials = [
    { name: 'UEM', description: 'Engenharia Mecânica' },
    { name: 'FGV', description: 'MBA Executivo' },
    { name: 'USP', description: 'Especialização' },
    { name: 'TJPR', description: 'Perito Judicial' }
  ]

  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Consultoria
            <span className="block text-secondary">Especializada</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experiência de campo e visão estratégica para entregar resultados 
            financeiros em projetos complexos de engenharia.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <div
              key={service.title}
              className="group"
            >
              <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${service.color} text-white`}>
                      <service.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm font-medium text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/contato">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white group-hover:bg-secondary transition-all duration-300"
                      >
                        {service.cta}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Credentials Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-primary mb-8">
            Credenciais e Formação
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {credentials.map((credential) => (
              <div
                key={credential.name}
                className="text-center"
              >
                <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-primary mb-2">{credential.name}</div>
                  <div className="text-sm text-muted-foreground">{credential.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Pronto para transformar seus desafios em resultados?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Nossa consultoria especializada combina experiência prática com 
              ferramentas digitais para entregar economia real e eficiência operacional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold"
                >
                  Agendar Consultoria
                </Button>
              </Link>
              <Link href="/servicos">
                <Button 
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  Ver Todos os Serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 