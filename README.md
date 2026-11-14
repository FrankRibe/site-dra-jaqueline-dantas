# Site da Dra. Jaqueline Dantas

Site institucional responsivo em HTML, CSS e JavaScript. Apresenta a profissional, tratamentos, resultados, clínica e canais de contato. Não possui login, banco de dados ou agendamento interno.

## Documentação

Base revisada em 14/11/2026 a partir dos arquivos locais e das publicações verificadas nesta sessão.

- [Escopo e arquitetura](docs/arquitetura.md)
- [Ambientes, publicação e recuperação](docs/operacao.md)
- [Testes e critérios de aceite](docs/testes.md)
- [Manutenção, segurança e pendências](docs/manutencao.md)

## Endereços

| Ambiente | Endereço |
|---|---|
| Desenvolvimento | http://localhost:4173/ |
| Homologação | https://hml-dra-jaqueline-dantas.pages.dev/ |
| Produção | https://frankribe.github.io/site-dra-jaqueline-dantas/ |
| Repositório | https://github.com/FrankRibe/site-dra-jaqueline-dantas |

## Executar

Na pasta do projeto, com Python 3 instalado:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Abra http://localhost:4173/. Não é necessário compilar. Ctrl+C encerra o servidor.

Para testes, instalar Node.js 22 e Python 3:

```sh
npm ci --ignore-scripts
npx playwright install chromium webkit
npm test
```

No Linux, a instalação dos navegadores pode exigir `npx playwright install --with-deps chromium webkit`. Os testes usam a porta 4180.
