# Ambientes, publicação e recuperação

## Ambientes

| Ambiente | Origem | Finalidade |
|---|---|---|
| DEV | Arquivos locais, servidor Python na porta 4173 | Desenvolvimento |
| HML | Branch `hml`, Cloudflare Pages `hml-dra-jaqueline-dantas` | Validação |
| PRD | Branch `main`, GitHub Pages | Visitantes |

Endereços no README. Homologação é acessível por endereço público: não usar documentos privados de pacientes.

## Publicar uma alteração

1. Conferir `git status`, preservar mudanças locais e atualizar referências remotas.
2. Criar branch de trabalho, implementar e executar testes.
3. Abrir PR para `hml`; revisar alterações e checks antes do merge.
4. Aguardar deploy, validar em computador e celular e registrar aprovação.
5. Abrir PR para `main`. Se houver divergência, usar branch de promoção e integrar a base de `main` nela, preservando proteções.
6. Aguardar checks aprovados na versão final do PR e integrar a alteração aprovada.
7. Conferir deploy e abrir produção para verificar a versão entregue.

Não usar reset destrutivo ou push forçado para resolver divergências sem avaliar o trabalho existente.

## Proteção e testes

Check: `Site tests`. Configuração de referência: PR obrigatório, check aprovado, branch atualizada e sem bypass. Regras são configurações do GitHub, fora do código; conferir ao alterar acessos ou fluxo.

Os provedores publicam quando as branches configuradas recebem commits. Testes de push e deploy podem executar em paralelo. O workflow sozinho não bloqueia deploy: a barreira preventiva é exigir os testes antes do merge. Sucesso dos testes e sucesso do deploy são verificações diferentes.

## Recuperação

Identificar PR/commit problemático; preparar PR de reversão da alteração, preservando mudanças posteriores; executar testes; integrar pelo fluxo protegido; verificar deploy e função afetada. Alinhar HML para não reintroduzir a falha.

Git recupera versões do código, mas não substitui recuperação das contas e configurações dos provedores.

| Sintoma | Conferir |
|---|---|
| Público desatualizado | Commit, branch de publicação, deploy e cache |
| Imagem ausente | Arquivo versionado, caminho e maiúsculas/minúsculas |
| WebKit falha | Logs, screenshot, trace e compatibilidade do runner |
| Contato incorreto | HTML, script.js e teste de contatos |

## Evidência da publicação

14/11/2026: PR #4 integrado à main, commit `60cf7b4f34d66ebbf308248a188b2da5746ef7e5`.

- [PR #4](https://github.com/FrankRibe/site-dra-jaqueline-dantas/pull/4)
- [Testes aprovados](https://github.com/FrankRibe/site-dra-jaqueline-dantas/actions/runs/43607302414)
- [Deploy aprovado](https://github.com/FrankRibe/site-dra-jaqueline-dantas/actions/runs/43607301634)

Evidência histórica, não monitoramento contínuo. A validação de HML pela Jaqueline foi informada no histórico do projeto; registrar futuras aprovações no respectivo PR.
