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
| Como chegar | Endereço, mapa incorporado, rotas e referências na região |
| Contato | WhatsApp, Instagram e atalho flutuante |

Os quatro tratamentos começam fechados. Abrir um fecha o anterior. Resina e porcelana permitem selecionar uma referência de cor, girar a lente e alternar para um sorriso ilustrativo. BL1 e A3 são alternativas: selecionar uma substitui a anterior, não combina duas famílias de cores.

As visualizações são ilustrativas, não previsões individuais ou escalas físicas calibradas. Indicação, tamanho e cor finais dependem da avaliação profissional. Não há envio de fotos de pacientes para simulação.

Galerias usam arquivos locais e links das publicações de origem; não há sincronização automática com o Instagram. No celular, a navegação usa menu lateral.

Em Resultados, Lentes reúne três comparativos com Antes e Depois identificados por caso. A ampliação navega apenas entre as etapas do mesmo caso; o antigo Caso 04 foi retirado por não corresponder ao mesmo paciente. Os comparativos têm largura limitada no computador, e Estética facial usa quatro colunas no desktop e duas no celular.

As fotografias horizontais são apresentadas por arquivos SVG que incorporam os JPEGs originais, com rotação e enquadramento. Os arquivos originais permanecem em `assets/`. Nos dois retratos recortados de Lentes, `data-full-src` mantém a foto completa na ampliação; os três sorrisos de Casos clínicos usam a versão alinhada também ao ampliar.

A troca de tratamento anima a saída e a entrada das fotos; os comparativos também aparecem ao entrar na tela. As fotos da abertura e da clínica têm parallax discreto. As animações respeitam a preferência de movimento reduzido.

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
| `localizacao.js` | Origem opcional, seleção Google Maps/Uber/99 e cópia do endereço |
| `assets/` | Imagens e demais recursos locais |
| `previa-celular.html` | Prévia auxiliar; não equivale a dispositivo físico |
| `tests/`, `playwright.config.js` | Testes locais e configuração de navegadores |
| `.github/workflows/site-checks.yml` | Testes no GitHub Actions |

Preservar a ordem dos scripts com `defer`: os renderizadores devem estar disponíveis antes de `resina.js`.

## Identidade e dependências

Direção visual: marfim, oliva e dourado. Tokens em `:root`: `--paper: #f7f5f0`, `--ink: #34392f`, `--gold: #a18a5d`, `--muted: #73756b`, `--line: #d9d7cc`. Fontes Google Fonts Cormorant Garamond e DM Sans, com alternativas Georgia e Arial/sans-serif.

Dependências externas: hospedagem GitHub Pages/Cloudflare Pages, Google Fonts, Google Maps, Uber, 99 e links de WhatsApp/Instagram. Não existe API autenticada de Instagram.

## Localização e rotas

Endereço confirmado pelo responsável: Rua São José de Mossamedes, 586, Núcleo Lageado, São Paulo – SP. O Google Maps confirmou esse número e informa o CEP 08440-540; o CEP 08440-525 inicialmente informado corresponde a outra rua e não é usado como destino.

O mapa utiliza o iframe obtido na opção “Incorporar um mapa” do Google Maps para esse endereço. O formulário abre Maps URLs (`https://www.google.com/maps/dir/?api=1`) no navegador ou aplicativo, com destino fixo e modo `driving`, `transit` ou `walking`. Não há chave de API, backend de rotas ou cálculo local de tempo/distância. O modo `transit` permite as alternativas de transporte público do Google, não restringe a consulta exclusivamente a ônibus.

A origem é opcional: vazia, é omitida por `localizacao.js`, e o Google Maps usa a localização disponível ou solicita um ponto de partida. Preenchida, é enviada ao Google apenas ao solicitar a rota. O site não pede geolocalização nem persiste a origem. A estimativa de tempo, distância e trânsito aparece no Google Maps. O formulário também funciona sem JavaScript; o botão de copiar é melhoria progressiva.

Referências verificadas no Google Maps em 17/11/2026 (sentido referência → clínica, percurso a pé):

| Referência | Distância aproximada | Opções sugeridas |
|---|---|---|
| EE Prof.ª Marília Santos Carvalho de Polillo, Rua Isabela, 363 | 350 m | A pé |
| Estação Guaianases, Avenida Salvador Gianetti | 2,1 km | Carro ou transporte público |

Critério solicitado: abaixo de 800 m sugerir a pé; a partir de 800 m, carro ou ônibus. As distâncias de referência são estáticas e identificadas como aproximadas. Não inferir distância para endereços digitados pelo visitante: o cálculo desse trajeto ocorre no Maps. Revalidar percursos antes de alterar as referências; não estimar metros pela imagem do mapa. O ponto de partida continua editável e o visitante pode escolher seu meio de transporte.

Fontes de manutenção: [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), [incorporação de mapas](https://support.google.com/maps/answer/7101463?hl=pt-BR), [cadastro oficial da escola](https://transparencia.educacao.sp.gov.br/Home/DetalhesEscola?codesc=444121) e [estações da CPTM](https://www.cptm.sp.gov.br/cptm/sua-viagem/linhas-e-estacoes).

O CSS contém regras sucessivas: revisar a cascata antes de adicionar sobrescritas. Há foco visível e tratamento de movimento reduzido, sem auditoria completa de acessibilidade. Ícones SVG evitam variações de emoji entre plataformas.

A regra `@media (hover: none)` desativa rolagem suave global em dispositivos de toque para evitar deslocamento de controles no WebKit. CSS e `script.js` usam a versão de cache `location-access-6`; `localizacao.js` usa `clinic-rides-4` e `resina.js` mantém `gallery-motion-12`.

## Fora do escopo

Login, pacientes, prontuários, documentos privados, agenda interna, financeiro e painel administrativo pertencem ao futuro sistema de gestão separado. Nenhum desses recursos foi entregue no site atual.


### Uber — abrir viagem com destino preenchido

A opção Uber usa um link universal HTTPS `https://m.uber.com/looking`, seguindo a [documentação oficial](https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction). `pickup=my_location` deixa a coleta/autorização da localização com a Uber. `drop[0]` contém o endereço público do consultório e a localização selecionada na busca da própria Uber em 17/11/2026: Rua São José de Mossamedes, 586, CEP 08440-540, coordenadas -23.5292527, -46.408732, identificador `e933a948-023a-a50b-a084-aa7bc98b490e` (`uber_places`). A Uber inicialmente associou as coordenadas do mapa do Google ao número 587; por isso o link usa a correspondência exata do número 586 obtida na interface da Uber, inclusive seu ID.

Ao selecionar Uber, o campo de origem do Maps é ocultado e desabilitado, preservando seu valor para uma eventual volta. O botão vira um link direto “Continuar na Uber”, sem janela intermediária, para favorecer a abertura do aplicativo. O visitante confirma ou ajusta o embarque e consulta preço, disponibilidade e tempo na Uber antes de solicitar a viagem. Não há pedido automático de corrida, pagamento, API autenticada ou armazenamento de localização no site. Sem JavaScript, a opção Uber fica oculta e as rotas do Maps continuam disponíveis. No celular, os cinco modos se organizam em duas colunas, com “A pé” na última linha.

A abertura nativa depende de aplicativo, dispositivo e navegador; a validação no navegador desktop não substitui teste em iPhone/Android físico. Não é necessário entrar na conta ou solicitar uma corrida para verificar o destino no navegador. Revalidar o link se a Uber alterar o cadastro do endereço.


### 99 — acesso oficial com destino manual

Em 17/11/2026 não foi encontrada documentação pública atual da 99 que permita validar uma integração de destino preenchido equivalente à Uber. A opção 99 usa o link `https://99.onelink.me/Mayr` publicado na [página oficial para baixar o app de passageiros](https://99app.com/passageiro/baixe-o-app-da-99/). Esse link pode encaminhar à loja; não promete abertura direta nem preenche origem ou destino. O site orienta a copiar o endereço, acessar a 99 e colar no campo “Para onde vamos?”. A cópia tem botão próprio e feedback de sucesso/erro; a navegação é um link separado para funcionar mesmo se a área de transferência for bloqueada. Nenhuma corrida é solicitada pelo site.

Não foram usados esquemas antigos não validados, IDs de parceiro inventados ou parâmetros de rota sem documentação. Para equivalência completa com a Uber, é necessário obter um mecanismo atual suportado pela 99 e validá-lo num celular físico. A opção fica oculta sem JavaScript; Maps continua sendo a alternativa básica. Cinco modos aparecem no desktop e duas colunas no celular, com “A pé” na última linha.


### Acesso rápido à localização

O menu principal inclui “Como chegar” destacado com ícone de localização, e a apresentação inicial traz “Nosso endereço” em um botão compacto, com altura e formato alinhados ao CTA principal; o endereço completo fica na seção de localização. Ambos apontam para `#localizacao`, permitindo acessar mapa e transportes sem percorrer as demais seções. O menu lateral é utilizado até 1100 px para acomodar todos os links; o breakpoint do CSS e o listener de `matchMedia` em `script.js` devem permanecer sincronizados. Selecionar o atalho no menu lateral fecha o diálogo antes da navegação pela âncora.
