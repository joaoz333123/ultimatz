# Deploy ULTIMATZ no Vercel

## Estrutura do Projeto
- **Site Principal**: `ultimatz/` - Portal institucional da ULTIMATZ
- **AppFin**: `appfin/` - Sistema de gestão financeira inteligente

## Fluxo de Acesso
1. Usuário acessa o site principal (ultimatz.com)
2. Clica em "AppFin" na seção de ferramentas
3. É redirecionado para a aplicação AppFin

## Deploy Estratégia

### Opção A: Deploy Separado (Recomendado)
1. **Site Principal**: Deploy do `ultimatz/` no Vercel
   - Domínio: `ultimatz.com`
   - Configuração: `vercel.json` (raiz)

2. **AppFin**: Deploy separado do `appfin/`
   - Domínio: `appfin.ultimatz.com` ou `app.ultimatz.com`
   - Configuração: `appfin/vercel.json`

### Opção B: Deploy Único
- Deploy do site principal (`ultimatz/`)
- AppFin como subaplicação

## Pré-requisitos

1. **Conta no Vercel** (gratuita)
2. **Banco PostgreSQL** (Vercel Postgres ou externo)
3. **Google OAuth** configurado
4. **Google Gemini API** configurado

## Variáveis de Ambiente para AppFin
```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://appfin.ultimatz.com"
NEXTAUTH_SECRET="gerar-com: openssl rand -base64 32"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_GEMINI_API_KEY="..."
CHAT_WRITE_ENABLED="true"
```

## Comandos Úteis
```bash
# Local
npm run dev

# Build
npm run build

# Prisma
npx prisma generate
npx prisma db push
```
