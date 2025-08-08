'use client'

import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const footerLinks = {
    ferramentas: [
      { name: 'SGF-Obras', href: '/ferramentas/sgf-obras' },
      { name: 'PGM', href: '/ferramentas/pgm' },
      { name: 'GIP', href: '/ferramentas/gip' }
    ],
    servicos: [
      { name: 'Gestão de Projetos', href: '/servicos/gestao-projetos' },
      { name: 'Otimização de Operações', href: '/servicos/otimizacao-operacoes' },
      { name: 'Perícia Técnica', href: '/servicos/pericia-tecnica' },
      { name: 'Gestão de CAPEX', href: '/servicos/gestao-capex' }
    ],
    empresa: [
      { name: 'Sobre', href: '/sobre' },
      { name: 'Cases', href: '/cases' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contato', href: '/contato' }
    ]
  }

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TZ</span>
              </div>
              <div>
                <div className="font-heading font-bold text-xl">
                  Tardivo Zanetti
                </div>
                <div className="text-sm text-white/70">
                  Engenharia Inteligente
                </div>
              </div>
            </div>
            <p className="text-white/80 mb-6">
              Transformamos desafios complexos em resultados financeiros através 
              de consultoria especializada e ferramentas digitais customizadas.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Ferramentas */}
          <div>
            <h3 className="font-bold text-lg mb-4">Ferramentas</h3>
            <ul className="space-y-2">
              {footerLinks.ferramentas.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-bold text-lg mb-4">Serviços</h3>
            <ul className="space-y-2">
              {footerLinks.servicos.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <a href="mailto:contato@tardivoengenharia.com.br" className="text-white/70 hover:text-white transition-colors duration-300">
                  contato@tardivoengenharia.com.br
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <a href="tel:+5511999999999" className="text-white/70 hover:text-white transition-colors duration-300">
                  (11) 99999-9999
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-white/70">
                  São Paulo, SP
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/contato">
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white"
                >
                  Agendar Consultoria
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Tardivo Zanetti Engenharia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 