import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BudgetList from '../budgets/BudgetList'

describe('BudgetList', () => {
  it('renderiza estado vazio com call to action', () => {
    render(<BudgetList budgets={[]} />)

    expect(screen.getByRole('heading', { name: 'Nenhum orçamento encontrado' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Criar Orçamento' })).toBeVisible()
  })

  it('chama o onDelete quando usuário confirma exclusão', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn().mockResolvedValue(undefined)

    render(
      <BudgetList
        budgets={[
          {
            id: 'budget-1',
            name: 'Marketing 2025',
            description: 'Campanha digital',
            amount: 5000,
            spent: 1200,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            project: { id: 'project-1', name: 'Lançamento Produto' },
            approvals: [],
          },
        ]}
        onDelete={onDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(onDelete).toHaveBeenCalledWith('budget-1')
  })
})
