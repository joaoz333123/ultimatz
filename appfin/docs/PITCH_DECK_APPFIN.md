---
marp: true
theme: default
paginate: true
size: 16:9
headingDivider: 1
---

# Appfin
Gestão Financeira Inteligente com IA

- "Transformando aprovações e orçamentos em decisões rápidas, auditáveis e com governança."
- Contato: contato@appfin.com.br | www.appfin.com.br

---

# Problema

- Aprovações de compras e orçamentos fragmentadas (planilhas, e-mails, chats)
- Falta de governança: quem aprovou, quando, por quê; SLAs estourados
- Baixa visibilidade sobre status, gargalos e impacto no caixa
- Fluxos diferentes por empresa/unidade e dificuldade de padronizar
- Dados espalhados: documentos anexos, cotações e contratos sem rastreabilidade

---

# Nossa Solução

- Plataforma unificada de gestão de orçamentos, aprovações e documentos
- Esteira de aprovação configurável por Workflow
- Chat com IA (Gemini) para criar Projetos, Orçamentos e Workflows via linguagem natural
- Auditoria completa e relatórios em um só lugar
- Operação inicial com base única de dados (single-company), evoluindo para multi-tenant

---

# Produto em 1 Minuto

- Crie Projetos e equipes com papéis
- Registre Orçamentos (valor, descrição, anexos)
- Vincule ao Workflow ativo e gere Aprovações automáticas
- Cada aprovador recebe fila ("Minhas Aprovações")
- Ações: Aprovar/Recusar/Comentar, com prazos (SLA)
- Indicadores, filtros e exportações

---

# Diferencial IA (Gemini)

- Criação e ajuste de Workflows por conversa (NLP, sem comandos rígidos)
- Criação de Projetos e Orçamentos por linguagem natural
- Aprendizado contínuo do modo de operar de cada empresa
- Pesquisa web e modo "Thinking" controlados pelo usuário
- Preparado para análise documental e geração de relatórios automáticos

---

# Mercado

- TAM (gestão financeira e procurement SaaS): [preencher estimativa de mercado]
- SAM (médias empresas LatAm): [preencher]
- SOM (primeiras praças/setores): [preencher]
- Tendências: transformação digital em finanças, governança e compliance

---

# Cliente-Alvo e Casos de Uso

- Empresas com processo de compras/contratações recorrentes
- Departamentos: Financeiro, Compras, Jurídico, Operações
- Casos: aprovação de despesas, cotações, contratos, renovação de serviços
- Benefícios: velocidade + controle + auditabilidade

---

# Tração (Status Atual)

- MVP funcional em Next.js 15 e TypeScript
- Autenticação (NextAuth), Workflows e Aprovações end-to-end
- Upload de Documentos e vínculo a Orçamentos
- Chat IA com histórico, Thinking e Pesquisa Web
- Exportação CSV e filtros principais
- Roadmap: dashboards com gráficos, PDF export, templates guiados por Chat

---

# Modelo de Negócio

- SaaS por assinatura (mensal/anual)
- Planos por volume (usuários/aprovações/documentos)
- Upsell: módulos avançados (compliance, integrações ERP, OCR avançado)
- Serviços: onboarding, migração, consultoria de fluxos

---

# Concorrência x Diferenciais

- Concorrentes: ERPs com módulos de compras, ferramentas de approval genéricas
- Diferenciais Appfin:
  - Foco em aprovações financeiras com IA nativa
  - Configuração de Workflow por conversa (menos fricção)
  - Rápida implantação (one-database inicialmente)
  - UX clara para aprovar e auditar

---

# Go-to-Market

- Primeiro nicho: médias empresas (serviços, varejo, indústria leve)
- Canais: inside sales + parcerias (contabilidade, consultorias)
- Provas de valor: POCs de 2 a 4 semanas
- Conteúdo: guias, cases e webinars sobre governança de aprovações

---

# Tecnologia (Stack)

- Frontend/Backend: Next.js 15 (App Router), TypeScript
- Autenticação: NextAuth (Google OAuth, JWT)
- ORM/DB: Prisma + SQLite (dev) → PostgreSQL (prod)
- IA: Google Gemini API (gemini-2.5-flash)
- UI: Tailwind, Radix UI, Recharts (dashboards), Lucide
- Validação: Zod; Formulários: React Hook Form

---

# Arquitetura Lógica

- Projetos → Orçamentos → Workflows → Aprovações → Documentos
- Chat IA orquestra criação e ajustes por linguagem natural
- Exportações (CSV) e em breve PDF
- Evolução planejada para multi-tenant por empresa

---

# Roadmap 6-9 Meses

- Dashboards com gráficos (KPIs e SLAs)
- Exportação PDF (orçamentos, relatórios, auditoria)
- Templates de Workflow guiados pelo Chat
- Filtros avançados (período/valor/projeto) e alertas de SLA
- Integrações: ERPs, SSO e armazenamento de documentos
- Multi-tenant completo com isolamento por empresa

---

# Segurança e Compliance

- Sessões seguras (JWT), controle de papéis
- Validações robustas (Zod) e checagens de ownership
- Logs de aprovação e trilha de auditoria
- Melhores práticas de proteção a dados em evolução (LGPD-ready)

---

# Métricas-Chave

- Tempo médio de aprovação por etapa
- Aderência a SLA (% aprovações no prazo)
- Volume de orçamentos por projeto e valor aprovado
- Taxa de adoção por aprovador e tempo de ciclo

---

# O Pedido (Ask)

- Captação: R$ [preencher]
- Uso dos recursos:
  - Produto e Engenharia (dash, PDF, templates IA, integrações)
  - Marketing e Vendas (POCs e canais)
  - Segurança/Compliance e Suporte
- Runway: [preencher] meses; Marcos: [preencher]

---

# Projeções (Resumo)

- Yr1: MRR, clientes, churn, LTV/CAC [preencher]
- Yr2: crescimento, expansão internacional [preencher]
- Unit Economics alinhada a CAC payback < 12 meses

---

# Time

- Fundadores e experiência relevante [preencher]
- Advisors e parceiros estratégicos [preencher]

---

# Demonstração (Screenshots)

- Login / Dashboard
- Orçamentos (lista e detalhe)
- Minhas Aprovações
- Chat IA criando Workflow/Orçamento
- Anexos/Documentos

Nota: inserir imagens reais do sistema antes de exportar.

---

# Encerramento

- "Aprovações mais ágeis, com governança e IA nativa."
- Contato: contato@appfin.com.br
- Obrigado!


