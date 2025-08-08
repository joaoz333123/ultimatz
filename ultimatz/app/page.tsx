import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Users, TrendingUp, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre - Tardivo Zanetti Engenharia',
  description: 'Conheça João Paulo Tardivo Zanetti e a missão da TZ Engineering de transformar desafios complexos em resultados financeiros.',
}

export default function SobrePage() {
  const credentials = [
    { name: 'UEM', description: 'Engenharia Mecânica', year: '2008' },
    { name: 'FGV', description: 'MBA Executivo', year: '2012' },
    { name: 'USP', description: 'Especialização', year: '2015' },
    { name: 'TJPR', description: 'Perito Judicial', year: '2018' }
  ]

  const achievements = [
    { number: '15+', label: 'Anos de experiência', icon: Users },
    { number: 'R$ 6M', label: 'Maior projeto executado', icon: TrendingUp },
    { number: '25%', label: 'Redução média de custos', icon: CheckCircle },
    { number: '100%', label: 'Projetos entregues no prazo', icon: Award }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-accent to-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">
              Sobre a
              <span className="block text-secondary">TZ Engineering</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transformamos desafios complexos em resultados financeiros através de 
              consultoria especializada e ferramentas digitais customizadas.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-4xl font-bold text-primary mb-6">
                João Paulo Tardivo Zanetti
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Engenheiro mecânico com mais de 15 anos de experiência em projetos complexos 
                de HVAC, retrofit e gestão de ativos. Especialista em transformar desafios 
                técnicos em resultados financeiros comprovados.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Formado pela UEM com MBA pela FGV e especialização pela USP, João combina 
                sólida formação acadêmica com experiência prática em projetos multimilionários 
                para shoppings, aeroportos e indústrias.
              </p>
              <p className="text-lg text-muted-foreground">
                Como perito judicial credenciado pelo TJPR, desenvolveu expertise única em 
                perícias técnicas complexas, servindo como base para disputas judiciais de 
                alta complexidade.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary">
                    Missão da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    &ldquo;Traduzir desafios complexos em resultados financeiros através de 
                    consultoria especializada e ferramentas digitais customizadas.&rdquo;
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.label} className="text-center p-4 bg-accent/50 rounded-lg">
                        <achievement.icon className="w-8 h-8 text-secondary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">{achievement.number}</div>
                        <div className="text-sm text-muted-foreground">{achievement.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-primary mb-6">
              Formação e Credenciais
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Formação acadêmica sólida e credenciais profissionais que garantem 
              resultados excepcionais para nossos clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {credentials.map((credential) => (
              <div
                key={credential.name}
                className="text-center"
              >
                <Card className="h-full border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-secondary to-secondary/80 text-white">
                        <Award className="w-6 h-6" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary">
                      {credential.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {credential.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Concluído em</p>
                      <p className="text-lg font-bold text-secondary">{credential.year}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-primary mb-6">
              Nossos Valores
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Princípios que guiam nosso trabalho e garantem resultados excepcionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Card className="h-full border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">
                    Excelência Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Rigor técnico e normativo em todos os projetos, garantindo 
                    qualidade superior e conformidade com padrões internacionais.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="h-full border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">
                    Resultados Financeiros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Foco em entregar economia real e ROI comprovado, transformando 
                    investimentos em retornos financeiros significativos.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="h-full border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">
                    Parceria Estratégica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Relacionamento de longo prazo baseado em confiança, transparência 
                    e compromisso com o sucesso dos nossos clientes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              Pronto para trabalhar conosco?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Nossa experiência e ferramentas podem transformar seus desafios 
              em resultados financeiros excepcionais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold">
                Agendar Consultoria
              </Button>
              <Button className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold">
                Ver Ferramentas
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 