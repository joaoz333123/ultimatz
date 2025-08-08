# Checklist Orçamentos + Workflows + Aprovações + Documentos

Status: CONCLUIDO | EM ANDAMENTO | PENDENTE | BLOQUEADO

## Progresso Geral
- Progresso total: 0%
- Última atualização: (preencher)

## Fase 0 — Decisões de Produto e Regras
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 0.1 | Regra de seleção do Workflow (Projeto/Template/Escolha) | PENDENTE | 0 | Regra definida e documentada |
| 0.2 | Papéis de aprovação e mapeamento (USER/ROLE/DEPARTMENT) | PENDENTE | 0 | Papéis e permissões definidos |

## Fase 1 — Projetos e Equipe (RBAC)
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 1.1 | API: gerenciar membros do projeto (add/list/remove) | PENDENTE | 0 | Endpoints com validação de roles |
| 1.2 | UI: gestão de membros (papéis, adicionar/remover) | PENDENTE | 0 | Tela funcional restrita a OWNER/ADMIN |
| 1.3 | RBAC: aplicar em ações de projeto | PENDENTE | 0 | OWNER/ADMIN editam; demais leitura |

## Fase 2 — Criação de Orçamento + Instância de Workflow
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 2.1 | Selecionar Workflow ativo ao criar orçamento | PENDENTE | 0 | Orçamento vinculado a WorkflowInstance |
| 2.2 | Criar WorkflowInstance no POST /api/budgets | PENDENTE | 0 | Registro criado com status PENDING |
| 2.3 | Gerar aprovações iniciais (steps paralelos suportados) | PENDENTE | 0 | Aprovações criadas por step 1 |
| 2.4 | UI: indicar/selecionar Workflow na criação (se necessário) | PENDENTE | 0 | Campo visível/indicação automática |

## Fase 3 — Esteira de Aprovações
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 3.1 | API: aprovar/rejeitar com comentário | PENDENTE | 0 | Rotas seguras e autorizadas |
| 3.2 | Backend: avanço de steps (sequencial/paralelo) | PENDENTE | 0 | Avanço e sincronização corretos |
| 3.3 | Atualizar status do orçamento (PENDING -> IN_PROGRESS -> APPROVED/REJECTED/COMPLETED) | PENDENTE | 0 | Status coerente ao avançar/decidir |
| 3.4 | UI: "Minhas Aprovações" (fila do usuário) | PENDENTE | 0 | Lista com filtros + ações |
| 3.5 | UI: ações rápidas na página do Orçamento | PENDENTE | 0 | Aprovar/Rejeitar/Comentar com feedback |

## Fase 4 — Documentos (Upload/Visualização)
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 4.1 | Escolher Storage e configurar (.env) | PENDENTE | 0 | Config segura com credenciais |
| 4.2 | API: upload validado (tipo/tamanho) + vínculo | PENDENTE | 0 | Registro em Document e acesso seguro |
| 4.3 | UI: FileUpload (drag&drop) + progresso + preview | PENDENTE | 0 | Upload e visualização funcionando |
| 4.4 | Acesso por membros do projeto | PENDENTE | 0 | Ownership/roles aplicados |

## Fase 5 — Página de Orçamentos (Reorganização)
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 5.1 | Filtros: Projeto, Status, Período, Valor | PENDENTE | 0 | Filtros front+back funcionais |
| 5.2 | Agrupamentos por Status | PENDENTE | 0 | Layout agrupado com contadores |
| 5.3 | Indicadores: totais, pendências, SLAs | PENDENTE | 0 | KPIs corretos no topo |
| 5.4 | Ações rápidas no card | PENDENTE | 0 | Ver Aprovações, Anexar, Aprovar, Editar, Próxima Etapa |

## Fase 6 — Auditoria, Notificações e SLA
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 6.1 | Auditoria: quem/ação/quando | PENDENTE | 0 | Log consultável |
| 6.2 | Notificações: e-mail/in-app | PENDENTE | 0 | Eventos de criação/pendência/decisão |
| 6.3 | SLA: contagem por step + alertas/escalonamento | PENDENTE | 0 | Indicadores e gatilhos |

## Fase 7 — Performance e Segurança
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 7.1 | Paginação e selects mínimos | PENDENTE | 0 | Respostas leves e rápidas |
| 7.2 | Rate limiting | PENDENTE | 0 | Limites adequados |
| 7.3 | RBAC consistente em tudo | PENDENTE | 0 | Testes por role |

## Fase 8 — Testes e Documentação
| ID | Tarefa | Status | % | Critérios de Aceite |
|----|--------|--------|---|----------------------|
| 8.1 | Testes de integração das APIs | PENDENTE | 0 | Casos principais |
| 8.2 | Testes E2E do fluxo completo | PENDENTE | 0 | Criar orçamento -> aprovar -> completar |
| 8.3 | Documentação de uso (manual do cliente) | PENDENTE | 0 | Guia atualizado |

Notas: este checklist será atualizado conforme avançarmos.
