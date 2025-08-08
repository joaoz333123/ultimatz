'use client'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Hero() {
  const metrics = [
    {
      value: 'R$ 230k',
      label: 'Economia média por cliente',
      delay: 0.2
    },
    {
      value: '3',
      label: 'Ferramentas especializadas',
      delay: 0.4
    },
    {
      value: '15+',
      label: 'Anos de experiência',
      delay: 0.6
    }
  ]

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-accent to-background relative overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0D2C4D_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
              Engenharia Inteligente
              <span className="block text-secondary mt-2">Personalizada</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Transformamos desafios complexos em resultados financeiros através de 
              <span className="text-primary font-semibold"> consultoria especializada </span>
              e <span className="text-secondary font-semibold">ferramentas digitais customizadas</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/ferramentas">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Ver Ferramentas
              </Button>
            </Link>
            <Link href="/contato">
              <Button className="border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Agendar Demo
              </Button>
            </Link>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {metrics.map((metric) => (
              <div
                key={metric.value}
                className="group"
              >
                <Card className="text-center border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-4xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                      {metric.value}
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-muted-foreground">
                      {metric.label}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">Empresas que confiam na TZ Engineering:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <span className="text-lg font-semibold text-primary">BRMalls</span>
              <span className="text-lg font-semibold text-primary">AM Foods</span>
              <span className="text-lg font-semibold text-primary">Aeroportos</span>
              <span className="text-lg font-semibold text-primary">Shoppings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 