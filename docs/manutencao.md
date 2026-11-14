# Manutenção, segurança e pendências

## Alterar conteúdo

| Mudança | Revisar |
|---|---|
| Textos e identificação | index.html |
| Telefone/mensagens | index.html, script.js e teste de contatos |
| Instagram | Links no HTML |
| Fotos e categorias | assets, elementos gallery-photo/data-category e testes da galeria |
| Cores/modelos | HTML e renderizadores; validar com a profissional |
| Visual/responsividade | styles.css e conferência desktop/mobile |

Ao adicionar foto, manter arquivo em assets, alt descritivo, categoria e link de origem quando aplicável. Evitar arquivos desnecessariamente grandes e conferir enquadramento no visualizador. Preservar identidade e retrato aprovados.

## Responsabilidades propostas

Jaqueline valida conteúdo profissional, imagens autorizadas e atendimento. Frank mantém código, ambientes, acessos, testes e publicações. Registrar responsáveis adicionais quando houver equipe.

## Segurança operacional

Tudo entregue pelo site estático é acessível ao visitante. Não inserir senhas, tokens ou documentos privados no código, assets, relatórios ou histórico Git. Manter dois fatores nas contas administrativas, códigos de recuperação privados e revisar colaboradores/integrações. Preservar proteções das branches. Atualizar dependências de testes via PR.

Em suspeita de comprometimento, proteger a conta afetada, revogar credenciais expostas, conferir alterações e restaurar versão conhecida pelo fluxo protegido. HTTPS não impede comprometimento de contas administrativas. Estas orientações não são certificação de segurança ou conformidade legal.

## Pendências

| Item | Estado |
|---|---|
| Autorizações de uso de imagens e revisão profissional | Manter evidências privadas; não comprovadas pelos arquivos do projeto |
| Auditorias completas de acessibilidade, desempenho e segurança | Não documentadas |
| Monitoramento de disponibilidade e alertas | Não implementado no código revisado |
| Domínio próprio | Não configurado nesta entrega; produção usa github.io |
| Recuperação de contas/configurações | Manter procedimento privado |
| Gestão de pacientes | Futuro projeto separado |

## Atualizar esta documentação

Em cada PR que muda comportamento, dependências, contatos ou ambientes, atualizar o documento correspondente. Descrever problema, mudança, testes, aprovação e reversão. Não anexar dados de pacientes ou credenciais.

Documentação preparada em 14/11/2026. Sua integração às branches de homologação e produção deve ocorrer por PR, preservando o histórico e os checks obrigatórios.
