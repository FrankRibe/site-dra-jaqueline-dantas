# Dra. Jaqueline Dantas

Primeira proposta visual de site institucional em HTML, CSS e JavaScript, responsiva, sem dependências de compilação.

## Visualizar

Abra `index.html` no navegador ou execute `python3 -m http.server 4173` nesta pasta e acesse http://localhost:4173.

## Escopo

- Apresentação, tratamentos, etapas de contato e perguntas frequentes.
- Links para o Instagram e WhatsApp com mensagem pronta por tratamento.
- O site não reserva horários. O atendimento confirma disponibilidade pelo WhatsApp.
- Identificação e contatos transcritos do perfil público @drajaquelinedantas em 13/11/2026.
- Direção visual proposta em marfim, oliva e dourado. A arte da abertura é uma composição abstrata em CSS, não uma foto do consultório.
- Fotografias originais, endereço, horários e textos finais ainda precisam ser fornecidos ou validados pela profissional antes da publicação pública.
- Fontes Google Fonts com alternativas locais de sistema.

## GitHub

Repositório: https://github.com/FrankRibe/site-dra-jaqueline-dantas

## Testes automáticos

Requisitos: Node.js 22+ e Python 3. Na primeira execução:

```sh
npm ci --ignore-scripts
npx playwright install chromium webkit
npm test
```

`npm run test:static` verifica referências locais, âncoras, atributos alternativos das imagens e sintaxe dos scripts. `npm run test:e2e` verifica tratamentos, cores, galeria, contatos, menu mobile e largura da página em Chromium desktop e WebKit com viewport de iPhone. WebKit emulado não substitui a validação num iPhone real. Os testes usam um servidor próprio na porta 4180.

O workflow `Site checks` roda em pull requests destinados a `hml` ou `main`, em pushes nessas branches e manualmente. Falhas geram relatório com capturas e trace por sete dias. Não há teste de disponibilidade dos serviços externos nem garantia de ausência de vulnerabilidades ou defeitos visuais.

Para bloquear merges, configure `Site tests` como status check obrigatório nas regras de proteção de `hml` e `main`, com branch atualizada e PR obrigatório. O workflow sozinho não bloqueia deploys: os provedores atuais publicam quando as branches recebem commits. Mantenha os testes obrigatórios antes do merge e não permita bypass. Fluxo: branch de trabalho → PR para hml → validação → PR para main.
