# Escopo e arquitetura

## Objetivo e funcionalidades

Apresentar a Dra. Jaqueline Dantas e facilitar o contato para avaliação. O atendimento confirma horários pelo WhatsApp; clicar no botão não cria uma reserva.

| Seção | Funcionalidade |
|---|---|
| Início e essência | Retrato, apresentação e links de contato |
| Tratamentos | Resina, porcelana, clareamento e reabilitação em painéis expansíveis |
| Resultados | Filtros de lentes, clareamento, retrabalhos e estética facial |
| Casos clínicos | Imagens ampliáveis e links das publicações originais |
| Etapas e dúvidas | Orientações sobre contato, avaliação e agendamento |
| Clínica | Fotografias ampliáveis do espaço |
| Contato | WhatsApp, Instagram e atalho flutuante |

Os quatro tratamentos começam fechados. Abrir um fecha o anterior. Resina e porcelana permitem selecionar uma referência de cor, girar a lente e alternar para um sorriso ilustrativo. BL1 e A3 são alternativas: selecionar uma substitui a anterior, não combina duas famílias de cores.

As visualizações são ilustrativas, não previsões individuais ou escalas físicas calibradas. Indicação, tamanho e cor finais dependem da avaliação profissional. Não há envio de fotos de pacientes para simulação.

Galerias usam arquivos locais e links das publicações de origem; não há sincronização automática com o Instagram. No celular, a navegação usa menu lateral.

## Componentes

O provedor entrega arquivos estáticos; as interações ocorrem no navegador. Node.js e Playwright são ferramentas de teste, não requisitos de execução do site publicado.

| Arquivo/pasta | Responsabilidade |
|---|---|
| `index.html` | Conteúdo, seções, contatos, controles e referências de imagens |
| `styles.css` | Identidade visual, responsividade e animações |
| `script.js` | Menu, contatos, painéis, filtros e visualizador |
| `faceta.js` | Renderização WebGL da faceta |
| `sorriso-ilustrativo.js` | Renderização do sorriso de referência em canvas |
| `resina.js` | Controles de cores, rotação e visualizações |
| `assets/` | Imagens e demais recursos locais |
| `previa-celular.html` | Prévia auxiliar; não equivale a dispositivo físico |
| `tests/`, `playwright.config.js` | Testes locais e configuração de navegadores |
| `.github/workflows/site-checks.yml` | Testes no GitHub Actions |

Preservar a ordem dos scripts com `defer`: os renderizadores devem estar disponíveis antes de `resina.js`.

## Identidade e dependências

Direção visual: marfim, oliva e dourado. Tokens em `:root`: `--paper: #f7f5f0`, `--ink: #34392f`, `--gold: #a18a5d`, `--muted: #73756b`, `--line: #d9d7cc`. Fontes Google Fonts Cormorant Garamond e DM Sans, com alternativas Georgia e Arial/sans-serif.

Dependências externas: hospedagem GitHub Pages/Cloudflare Pages, Google Fonts e links de WhatsApp/Instagram. Não existe API autenticada de Instagram.

O CSS contém regras sucessivas: revisar a cascata antes de adicionar sobrescritas. Há foco visível e tratamento de movimento reduzido, sem auditoria completa de acessibilidade. Ícones SVG evitam variações de emoji entre plataformas.

A regra `@media (hover: none)` desativa rolagem suave global em dispositivos de toque para evitar deslocamento de controles no WebKit. O CSS usa a versão de cache `touch-scroll-1` nesta revisão.

## Fora do escopo

Login, pacientes, prontuários, documentos privados, agenda interna, financeiro e painel administrativo pertencem ao futuro sistema de gestão separado. Nenhum desses recursos foi entregue no site atual.
