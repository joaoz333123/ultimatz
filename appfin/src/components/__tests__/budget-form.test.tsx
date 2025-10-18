import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BudgetForm from '../budgets/BudgetForm'

describe('BudgetForm', () => {
  const projects = [
    { id: 'project-1', name: 'Plataforma Web' },
    { id: 'project-2', name: 'App Mobile' },
  ]

  const workflows = [
    {
      id: 'workflow-1',
      name: 'Aprovação padrão',
      description: 'Fluxo base',
      isActive: true,
      steps: [
        { id: 'step-1', stepNumber: 1, name: 'Financeiro', type: 'APPROVAL' },
        { id: 'step-2', stepNumber: 2, name: 'Diretoria', type: 'APPROVAL' },
      ],
    },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('retorna para a página anterior ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {})

    render(<BudgetForm projects={projects} workflows={workflows} onCreated={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(backSpy).toHaveBeenCalledTimes(1)
  })

  it('envia o formulário e aciona onCreated com o id retornado', async () => {
    const user = userEvent.setup()
    const onCreated = jest.fn()

    const originalFetch = global.fetch
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: 'budget-99' }) } as Response)
    global.fetch = fetchMock as unknown as typeof fetch

    render(<BudgetForm projects={projects} workflows={workflows} onCreated={onCreated} />)

    await user.selectOptions(screen.getByLabelText('Projeto *'), 'project-1')
    await user.type(screen.getByLabelText('Nome do Orçamento *'), 'Orçamento Marketing')
    await user.type(screen.getByLabelText('Valor (R$) *'), '1500')
    await user.selectOptions(screen.getByLabelText('Workflow de Aprovação'), 'workflow-1')

    await user.click(screen.getByRole('button', { name: 'Criar Orçamento' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/budgets',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            projectId: 'project-1',
            name: 'Orçamento Marketing',
            description: '',
            amount: 1500,
          }),
        })
      )
    })

    expect(onCreated).toHaveBeenCalledWith('budget-99', 'workflow-1')

    global.fetch = originalFetch
  })
})
