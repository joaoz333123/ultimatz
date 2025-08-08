import { prisma } from './prisma'

export interface NotificationData {
  to: string
  subject: string
  body: string
  budgetId?: string
  workflowId?: string
  approvalId?: string
}

export class NotificationService {
  static async sendApprovalNotification(
    approvalId: string,
    budgetId: string,
    workflowId: string
  ) {
    try {
      const approval = await prisma.approval.findUnique({
        where: { id: approvalId },
        include: {
          budget: {
            include: {
              project: true,
              user: true,
            },
          },
          user: true,
        },
      })

      if (!approval || !approval.user?.email) {
        console.error('Aprovação ou usuário não encontrado')
        return
      }

      const budget = approval.budget
      const approver = approval.user

      const subject = `Nova Aprovação Pendente - ${budget.name}`
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2563eb; margin: 0 0 20px 0;">🔔 Nova Aprovação Pendente</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937;">${budget.name}</h3>
              
              <div style="margin-bottom: 15px;">
                <strong>Projeto:</strong> ${budget.project.name}<br>
                <strong>Valor:</strong> R$ ${budget.amount.toLocaleString('pt-BR')}<br>
                <strong>Solicitante:</strong> ${budget.user.name || budget.user.email}<br>
                <strong>Data:</strong> ${new Date(budget.createdAt).toLocaleDateString('pt-BR')}
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong>Descrição:</strong><br>
                <p style="margin: 5px 0; color: #6b7280;">${budget.description || 'Nenhuma descrição fornecida'}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/approvals" 
                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Ver Detalhes
                </a>
              </div>
            </div>
            
            <div style="font-size: 12px; color: #6b7280; text-align: center;">
              Esta é uma notificação automática do sistema AppFin.
            </div>
          </div>
        </div>
      `

      await this.sendEmail({
        to: approver.email,
        subject,
        body,
        budgetId,
        workflowId,
        approvalId,
      })

      console.log(`Notificação enviada para ${approver.email}`)
    } catch (error) {
      console.error('Erro ao enviar notificação de aprovação:', error)
    }
  }

  static async sendWorkflowCompletedNotification(
    workflowInstanceId: string,
    status: 'APPROVED' | 'REJECTED'
  ) {
    try {
      const instance = await prisma.workflowInstance.findUnique({
        where: { id: workflowInstanceId },
        include: {
          budget: {
            include: {
              project: true,
              user: true,
            },
          },
          workflow: true,
        },
      })

      if (!instance) {
        console.error('Instância de workflow não encontrada')
        return
      }

      const budget = instance.budget
      const requester = budget.user

      if (!requester.email) {
        console.error('Email do solicitante não encontrado')
        return
      }

      const statusText = status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'
      const statusColor = status === 'APPROVED' ? '#059669' : '#dc2626'
      const statusIcon = status === 'APPROVED' ? '✅' : '❌'

      const subject = `Workflow ${statusText} - ${budget.name}`
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: ${statusColor}; margin: 0 0 20px 0;">${statusIcon} Workflow ${statusText}</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937;">${budget.name}</h3>
              
              <div style="margin-bottom: 15px;">
                <strong>Projeto:</strong> ${budget.project.name}<br>
                <strong>Valor:</strong> R$ ${budget.amount.toLocaleString('pt-BR')}<br>
                <strong>Workflow:</strong> ${instance.workflow.name}<br>
                <strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span><br>
                <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/budgets/${budget.id}" 
                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Ver Orçamento
                </a>
              </div>
            </div>
            
            <div style="font-size: 12px; color: #6b7280; text-align: center;">
              Esta é uma notificação automática do sistema AppFin.
            </div>
          </div>
        </div>
      `

      await this.sendEmail({
        to: requester.email,
        subject,
        body,
        budgetId: budget.id,
        workflowId: instance.workflowId,
      })

      console.log(`Notificação de conclusão enviada para ${requester.email}`)
    } catch (error) {
      console.error('Erro ao enviar notificação de conclusão:', error)
    }
  }

  private static async sendEmail(data: NotificationData) {
    // Em produção, você usaria um serviço como SendGrid, AWS SES, etc.
    // Por enquanto, vamos simular o envio
    console.log('📧 Email enviado:', {
      to: data.to,
      subject: data.subject,
      body: data.body.substring(0, 100) + '...',
    })

    // Aqui você implementaria a integração real com o serviço de email
    // Exemplo com SendGrid:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    await sgMail.send({
      to: data.to,
      from: process.env.FROM_EMAIL,
      subject: data.subject,
      html: data.body,
    })
    */
  }
}
