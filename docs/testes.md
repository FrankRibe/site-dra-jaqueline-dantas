# Testes e critérios de aceite

## Comandos

```sh
npm run test:static
npm run test:e2e
npm test
npx playwright test --project=mobile-webkit --grep "tratamentos fechados" --repeat-each=5
```

Servidor exclusivo em `127.0.0.1:4180`, sem reutilizar servidor existente. Relatórios em `playwright-report/`, evidências em `test-results/`.

| Teste | Cobertura |
|---|---|
| Estático | Referências locais do HTML, âncoras, IDs duplicados, presença de alt, noopener em nova aba e sintaxe JS |
| Tratamentos | Quatro painéis fechados; resina/porcelana; seleção exclusiva BL1/A3 e legenda do sorriso |
| Galeria | Clareamento com três fotos, abertura, próxima imagem e fechamento |
| Menu mobile | Abertura, navegação e fechamento |
| Contatos | WhatsApp esperado e perfil do Instagram |
| Carregamento/layout | Imagens, largura sem transbordamento, erros JS e respostas locais de erro nos casos executados |

Chromium desktop e WebKit com configuração iPhone 13. Dez combinações, sendo o teste de menu ignorado no desktop: nove executadas e uma ignorada. Seleção de cores usa toque em mobile. O CI repete esse caso cinco vezes adicionais, sem retries.

## CI

Workflow `Site checks`, job `Site tests`; Node 22, Ubuntu 24.04, Playwright 1.56.1. Executa em PR para hml/main, push nessas branches e manualmente. Execuções antigas da mesma referência podem ser canceladas por uma nova. Artefatos de falha ficam disponíveis por sete dias.

## Aceite manual

- Texto, identidade, retrato, alinhamento dos cards e enquadramento das fotos.
- Quatro tratamentos, controles de cor, rotação e sorriso.
- Todas as categorias, visualizador e fotos da clínica.
- Menu, áreas de toque e leitura no celular físico, incluindo Safari.
- Navegação por teclado, foco e fechamento dos diálogos.
- Links externos, sem envio involuntário de mensagens.
- Versão entregue em produção após deploy.

## Limites

Não há comparação visual automatizada, auditoria completa de acessibilidade/segurança, teste de carga ou disponibilidade dos serviços externos. WebKit emulado não substitui iPhone físico. A presença de alt não garante qualidade da descrição. Mudança intencional de contatos ou quantidade de fotos exige atualizar expectativas, não simplesmente remover testes que falham.
