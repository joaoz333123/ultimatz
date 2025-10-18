# ULTIMATZ - Tardivo Zanetti Engenharia Inteligente

## 🚀 Sobre o Projeto

Website institucional da **Tardivo Zanetti Engenharia Inteligente (TZ Engineering)**, desenvolvido como um hub híbrido que combina showcase institucional com cases de sucesso e um hub técnico oferecendo acesso a ferramentas digitais personalizadas.

## 🎯 Objetivos

- **Showcase Institucional**: Apresentar a consultoria especializada em engenharia mecânica de alta performance
- **Cases de Sucesso**: Demonstrar resultados e ROI das ferramentas desenvolvidas
- **Hub de Ferramentas**: Comercializar e entregar ferramentas digitais customizadas
- **Marketing Digital**: Alcançar ~2.000 visitas mensais via estratégias de marketing digital

## 🛠️ Tecnologias

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **CMS**: Sanity.io
- **Deploy**: Vercel
- **Versionamento**: Git + GitHub

## 📁 Estrutura do Projeto

```
ULTIMATZ/
├── ultimatz/           # Projeto principal Next.js
│   ├── app/           # Páginas e rotas
│   ├── components/    # Componentes React
│   ├── lib/          # Utilitários
│   └── sanity/       # Configuração CMS
├── appfin/            # Ferramenta AppFin (em desenvolvimento)
└── backup_AMFin(1)/  # Ferramenta financeira existente
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
cd ultimatz
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📄 Páginas Principais

- **Home**: Landing page com Hero, Tools, Cases e Services
- **Ferramentas**: Showcase das ferramentas digitais
- **Serviços**: Detalhamento dos serviços de consultoria
- **Cases**: Cases de sucesso completos
- **Sobre**: Informações sobre João Paulo e a empresa
- **Contato**: Formulário de contato e agendamento

## 🎨 Design System

- **Cores**: Paleta personalizada TZ Engineering
- **Fontes**: Poppins (títulos) + Inter (corpo)
- **Componentes**: Shadcn/ui + Tailwind CSS
- **Responsivo**: Mobile-first design

## 🔧 Funcionalidades

- ✅ Landing page responsiva
- ✅ Navegação completa
- ✅ Integração Sanity CMS
- ✅ SEO otimizado
- ✅ Performance otimizada
- ✅ Deploy automatizado

## 📈 Próximos Passos

1. **AppFin**: Desenvolvimento da ferramenta financeira
2. **Integração**: Incorporar AppFin no site principal
3. **Marketing**: Implementar estratégias de SEO e marketing digital
4. **Analytics**: Configurar tracking de conversões

## 🔍 Auditoria de Integração (jan/2025)

### Status operacional

- ✅ `npm run build` do site institucional Ultimatz (com `NEXT_DISABLE_FONT_DOWNLOADS=1` no script de build)
- ✅ `npm run build` do AppFin após ajustar `useSearchParams` com `Suspense`
- ✅ Rota `/appfin` no site principal com fallback guiado e redirecionamento quando `NEXT_PUBLIC_APPFIN_URL` está definida
- ⚠️ Aviso recorrente do Next.js sobre múltiplos `package-lock.json` (raiz e subprojetos). Mantido como está porque os projetos são independentes, mas vale alinhar no deploy

### Problemas corrigidos nesta auditoria

1. `appfin/package.json` estava com resíduos de merge (`=======`) e scripts duplicados — revisado para JSON válido
2. Build do site Ultimatz falhava offline por download automático de fontes Google — fonte agora carregada via CSS e script `build` força `NEXT_DISABLE_FONT_DOWNLOADS`
3. Página `appfin/src/app/auth/signin/page.tsx` não envolvia `useSearchParams` em `Suspense`, impedindo o prerender — componente reestruturado
4. Ausência de rota `/appfin` no Next.js principal — criada página de integração com instruções e redirecionamento condicionado à variável de ambiente

### Como executar os projetos em conjunto

```bash
# 1. Site institucional
cd ultimatz
npm install
npm run dev

# 2. AppFin (porta alternativa para coexistir)
cd ../appfin
npm install
npm run dev -- --port 3001
```

Configure a variável `NEXT_PUBLIC_APPFIN_URL` no `.env.local` do site principal para apontar para a URL local ou publicada do AppFin (ex.: `http://localhost:3001`).

### To-Do recomendado

- [ ] Definir `NEXT_PUBLIC_APPFIN_URL` e URLs finais de produção antes do deploy
- [ ] Preencher `.env` do AppFin com credenciais de Google OAuth, Gemini e banco PostgreSQL (o schema Prisma usa `provider = "postgresql"`)
- [ ] Revisar documentação do AppFin (`appfin/README.md`) para alinhar instruções de banco local (hoje menciona SQLite, mas o schema aponta para PostgreSQL)
- [ ] Configurar migrações `prisma migrate` e rotinas de seed antes do go-live
- [ ] Tratar aviso do Next.js sobre múltiplos lockfiles caso seja necessário consolidar a pipeline de CI/CD

## 👨‍💻 Desenvolvimento

- **Responsável**: Cursor (Claude) - Todo desenvolvimento técnico
- **Validação**: João Paulo - Aprovação de conteúdo e funcionalidades

## 📞 Contato

**João Paulo Tardivo Zanetti**
- Engenheiro Mecânico
- Especialista em HVAC, Retrofit, Perícia Técnica
- Consultoria em Gestão de CAPEX

---

*Desenvolvido com Next.js 15 e TypeScript*
