import { z } from 'zod'

// Validação para criação de projetos
export const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().optional(),
})

// Validação para criação de orçamentos
export const budgetSchema = z.object({
  projectId: z.string().min(1, 'Projeto é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().optional(),
  amount: z.number().positive('Valor deve ser positivo').min(0.01, 'Valor mínimo é R$ 0,01'),
})

// Validação para aprovações
export const approvalSchema = z.object({
  budgetId: z.string().min(1, 'Orçamento é obrigatório'),
  comment: z.string().optional(),
  status: z.enum(['APPROVED', 'REJECTED']),
})

// Validação para upload de documentos
export const documentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['PDF', 'IMAGE', 'SPREADSHEET', 'OTHER']),
  size: z.number().positive('Tamanho deve ser positivo'),
})

// Tipos TypeScript derivados dos schemas
export type ProjectFormData = z.infer<typeof projectSchema>
export type BudgetFormData = z.infer<typeof budgetSchema>
export type ApprovalFormData = z.infer<typeof approvalSchema>
export type DocumentFormData = z.infer<typeof documentSchema>
