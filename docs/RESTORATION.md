# Restauração do blog skhaz.com

## Escopo recuperado

O blog genuíno esteve disponível em `http://www.skhaz.com/blog/`. A captura mais antiga encontrada é de abril de 2008; o conteúdo migrado começa em 4 de fevereiro de 2008. A última publicação encontrada é de 9 de abril de 2009. Capturas posteriores do domínio mostram estacionamento e páginas de venda, portanto foram descartadas.

| Item | Recuperado |
| --- | ---: |
| Posts | 35 (34 integrais e 1 parcial) |
| Páginas de apoio | 2 (`Lista de Posts` e `Política de Privacidade`) |
| Fase predecessora | 15 origens WordPress.com fundidas aos posts canônicos, sem duplicação; 1 aviso de migração preservado separadamente |
| Comentários | 72 integrais de 83 registrados |
| Período | 04/02/2008–09/04/2009 |
| Imagens locais | 25 |
| Imagens não localizadas | 11 posições (6 identificadas no ImageShack) |
| Downloads não localizados | 3 |

## Prior Art

| Candidato | Fonte | Veredito | Uso |
| --- | --- | --- | --- |
| RSS completo do WordPress 2.5 | Wayback Machine, captura de 2008 | adotar | Corpo integral dos 22 primeiros posts, datas e taxonomia |
| Páginas individuais | Wayback Machine | compor | Comentários e confirmação das URLs originais |
| Página inicial de julho de 2008 | Wayback Machine | compor | Sete posts integrais ausentes do RSS antigo |
| Página inicial de setembro de 2008 | Wayback Machine | compor | Trecho sobrevivente de `boost-136` |
| Índice ARC 2009–2010 | Common Crawl | compor | Cinco posts posteriores que não aparecem no índice da Wayback |
| `skhaz.wordpress.com` | WordPress.com | compor | arquivos de mídia ainda disponíveis na origem |
| Capturas do WordPress.com de 2008 | Wayback Machine | compor sem duplicar | confirmar 15 posts que migraram para `skhaz.com/blog` e associar a proveniência aos registros canônicos |
| Página inicial do WordPress.com de 09/04/2008 | Wayback Machine | preservar separadamente | aviso contemporâneo exclusivo que anunciou a mudança para `www.skhaz.com` |
| iNove, por mg12 | repositório público GPL-2.0 | adaptar | Arte da última identidade visual observada |
| `skhaz/nullonerror` e `nullonerror-posts` | GitHub | não misturar | Continuação editorial em outro domínio e outro período |

**Decisão:** construir uma versão estática nova, porque o WordPress original e seu banco não estão disponíveis. O HTML histórico é preservado como conteúdo, mas scripts e plugins antigos não são reativados.

## Descoberta

### Wayback Machine

O CDX retornou 269 registros para `www.skhaz.com/*`, dos quais 190 tinham status 200. O blog aparece em 2008; a partir de 2011, o domínio já exibia uma página de estacionamento. O RSS capturado contém 22 itens completos, e o índice “Lista de Posts” confirma títulos, datas e contagens de comentários. Capturas posteriores da página inicial revelaram outros oito posts: sete corpos integrais entre maio e julho e um trecho parcial em setembro. A página `Política de Privacidade` também foi preservada na URL histórica.

O item do RSS para `classe-stdstring-stl-no-vc-6-provoca-corrupcao-da-memoria` fornece corpo integral, URL, data, autor, categorias e GUID. Como nenhuma captura individual desse post foi localizada, sua proveniência agora aponta para a captura específica do FeedBurner de `20080528143819`, em vez de uma consulta Wayback curinga.

Os posts adicionais são `deque-shared_ptr-for_each-mem_fun-cabummm`, `agendamento-de-tarefas`, `instalador-da-boost`, `os-10-ultimos-mais-usados-comandos-no-linux`, `7-habits-for-effective-text-editing-20`, `wordpress-god`, `ctrlc-e-ctrlv` e `boost-136`. A captura não informa o dia exato de `7-habits-for-effective-text-editing-20`; para `boost-136`, preserva apenas a introdução e comprova que já estava publicado em 23/09/2008.

Artefatos preservados (origens detalhadas em `archive/sources/README.md`):

- `archive/sources/wayback-cdx.json`
- `archive/sources/wayback-feed-cdx-2008.json`
- `archive/sources/wayback-feed-2008.xml`
- `archive/sources/wayback-post-index-2008.html`
- `archive/sources/wayback-privacy-2008.txt`
- `archive/sources/wayback-home-2008-07.html`
- `archive/sources/wayback-home-2008-09.html`
- `archive/sources/wayback-wordpress-god-2008.html`

### Fase WordPress.com e a mudança de domínio

A enumeração de `skhaz.wordpress.com` na Wayback Machine encontrou quinze publicações anteriores à migração. Título, data, ID e corpo correspondem a quinze posts que já estavam preservados sob `skhaz.com/blog`: `classe-timer`, `mutable-que-raios-e-isso`, `wintermoon-no-contest-da-pdj`, `carregando-imagens-com-ou-sem-canal-alpha`, `visual-studio-2008`, `um-pouco-mais-sobre-namespace`, `one`, `classe-stdstring-stl-no-vc-6-provoca-corrupcao-da-memoria`, `qual-a-cara-da-sua-ide`, `eliminando-o-codigo-fonfarrao`, `documentacao-da-wintermoon-lancada`, `meu-mousepad-apos-minha-namorada-ver`, `codeblocks`, `lancado-arret-3d` e `a-vida-e-um-jogo`.

Esses quinze resultados não foram republicados. `content/wordpress-com-origins.json` associa cada URL, ID e captura WordPress.com ao post canônico existente. O índice `/arquivo/skhaz-wordpress-com/` aponta para as mesmas quinze rotas em `/blog/`, e cada página expõe as duas proveniências. Assim, a contagem continua em 35 posts.

A captura inicial de `20080209030031` preserva cinco posts; a página inicial de `20080409155551` preserva quatorze dos quinze e o aviso de migração. A página inicial de `20080920111949` registra que “ONE” já tinha dois comentários, embora somente um corpo tenha sido recuperado. Três capturas individuais posteriores preservam integralmente `mutable-que-raios-e-isso` com seis comentários, `visual-studio-2008` com dois e `qual-a-cara-da-sua-ide` com sete. Uma captura de `/page/2/` fornece confirmação adicional de `classe-timer`.

A página inicial de `skhaz.wordpress.com` capturada em `20080409155551`, um dia após a publicação, preserva ainda o aviso exclusivo **“Mudando de casa”** com o texto completo anunciando `http://www.skhaz.com/`. O registro informa data de 8 de abril de 2008, categoria C++ e nenhum comentário. Como esse aviso nunca foi comprovado sob `/blog/`, ele é publicado em `/arquivo/skhaz-wordpress-com/2008/04/08/mudando-de-casa/`, fora dos 35 posts do corpus principal.

A API pública atual do WordPress.com identifica o mesmo objeto como site `2393109`, post `59`, mas registra uma modificação em `2012-02-23T22:26:25Z` e hoje mostra outro texto apontando para NULL on error. Essa revisão posterior foi preservada apenas como evidência da mutação: não substitui a captura contemporânea e não traz o conteúdo posterior de NULL on error para este arquivo.

A mesma pesquisa corrigiu a mídia de “Lançado o Arret”: a captura contemporânea aponta para `arret.png`, cujo original WordPress.com ainda responde com um PNG válido de 646 × 511. O post agora abre esse original local, SHA-256 `30f0c36588011e8aff5065e6034f50e4d9f162d1be76e0f11b8b437e2aa5d397`, sem alterar o thumbnail histórico.

O WordPress.com também ainda entrega `autoversioning.jpg`, JPEG válido de 800 × 600 e SHA-256 `3456dab46d00d593fe4f3a5dc14941c18fd0e3986ce4a2a293e621d9ae50e805`. Ele mostra o menu do plugin e é visualmente diferente do thumbnail de `integracao_com_svn.jpg`, que mostra a janela de configuração efetivamente exibida no post. Por isso foi preservado somente como attachment suplementar em `archive/sources/wordpress-com-autoversioning-2008.jpg`, sem ser apresentado como substituto do original ausente.

Artefatos preservados:

- `archive/sources/wayback-wordpress-com-cdx-2008.json`
- `archive/sources/wayback-wordpress-com-cdx-2008-2010.json`
- `archive/sources/wayback-wordpress-com-home-2008-02.html`
- `archive/sources/wayback-wordpress-com-home-2008-04.html`
- `archive/sources/wayback-wordpress-com-home-2008-09.html`
- `archive/sources/wayback-wordpress-com-page-2-2008.html`
- `archive/sources/wayback-wordpress-com-mutable-2008.html`
- `archive/sources/wayback-wordpress-com-visual-studio-2008.html`
- `archive/sources/wayback-wordpress-com-qual-a-cara-da-sua-ide-2008.html`
- `archive/sources/wordpress-mudando-de-casa-2026-07-26.json`
- `archive/sources/wordpress-mudando-de-casa-replies-2026-07-26.json`

### Common Crawl

Os índices `CC-MAIN-2009-2010` e `CC-MAIN-2012` revelaram cinco URLs adicionais:

1. `por-onde-andas-skhaz` — 10/12/2008;
2. `qt-agora-e-lgpl` — 14/01/2009;
3. `meme-aleatoriedades` — 05/02/2009;
4. `hoje-sexta-feira-13-o-unix-time-chegara-ao-valor-1234567890` — 13/02/2009;
5. `maquina-do-tempo-com-o-vim` — 09/04/2009.

Os registros ARC foram lidos diretamente por `filename`, `offset` e `length`. Esses metadados permanecem no campo `source.record` de cada post recuperado.

Uma segunda investigação usou os índices brutos, sem depender da API pública instável. Em 27/07/2026, foram examinados todos os **125 índices anunciados** pelo inventário de `data.commoncrawl.org`, de `CC-MAIN-2008-2009` a `CC-MAIN-2026-25`. Para 22 prefixos SURT — variantes com e sem `www`, os oito uploads/ZIPs locais e os seis caminhos ImageShack — a busca binária leu 15.980.084.528 bytes de `cluster.idx`, baixou e descompactou 723 blocos CDX (117.492.051 bytes comprimidos) e realizou 2.750 consultas, sem erro e sem linha correspondente. Dois arquivos ARC especialmente relevantes também foram integralmente examinados: 200.014.588 bytes comprimidos e 660.100.325 bytes descompactados, sem cabeçalho de registro dos alvos.

Como nenhum localizador CDXJ foi encontrado, não existia registro ARC/WARC candidato para validação de payload. Essa é uma negativa rigorosa para o inventário, intervalo e prefixos documentados — não prova de inexistência global, cobertura de arquivos privados ou garantia sobre coleções futuras. Os detalhes reproduzíveis, hashes de cada índice e de cada bloco, ranges e limites da busca estão em `archive/sources/commoncrawl-missing-assets-raw-index-2026-07-27.json` e `archive/sources/commoncrawl-missing-assets-remaining-indexes-2026-07-27.json`.

### ImageShack

Em 26 de julho de 2026, o perfil público `imageshack.com/user/skhaz` ainda declarava 49 uploads feitos entre agosto de 2007 e maio de 2008. A API pública preservava metadados para os seis arquivos do ImageShack referenciados pelo blog:

| Arquivo | ID do ImageShack | Data registrada (UTC) | Dimensões registradas |
| --- | --- | --- | ---: |
| `msvczm8.png` | `2jmsvczm8p` | 14/12/2007 13:44:03 | 1024 × 768 |
| `msvc9mb0.png` | `bamsvc9mb0p` | 08/02/2008 11:56:45 | 756 × 581 |
| `2242002764ab16f49f4dofs2.png` | `b92242002764ab16f49f4dofs2p` | 14/02/2008 20:10:45 | 1024 × 768 |
| `finalor9.png` | `79finalor9p` | 25/02/2008 13:03:07 | 1145 × 808 |
| `mapakm5.png` | `6omapakm5p` | 02/05/2008 13:17:40 | 1024 × 768 |
| `mapatermicoyb6xb3.png` | `6omapatermicoyb6xb3p` | 02/05/2008 13:18:35 | 800 × 600 |

Cinco datas coincidem com o dia das respectivas publicações; `msvczm8.png` antecede em dois meses o post que reutilizou a imagem. Os registros confirmam conta, nomes, shards e buckets históricos. O valor `filesize` não foi interpretado porque a API não documenta sua unidade para esses registros legados. O snapshot bruto está em `archive/sources/imageshack-profile-2026-07-26.json`.

Os IDs continuam resolvendo para páginas e JSON de metadados, mas nenhuma rota testada entregou bytes de imagem. A primeira rodada cobriu originais, miniaturas, Imagizer e downloads. A rodada ampliada derivou rotas do próprio JavaScript público do ImageShack e verificou mais 54 combinações de `/download`, `/a/img…`, perfis `v2`, tamanhos e miniaturas: todas terminaram em HTML/JSON, corpo vazio ou `404`, nunca em uma assinatura de imagem. Outras 12 rotas `v2`, derivadas de cada ID público e das dimensões originais, responderam `200` e anunciaram `image/png` ou `application/octet-stream`, mas os 12 corpos tinham zero bytes e SHA-256 do vazio; MIME sem payload não foi aceito.

A [documentação do ArchiveTeam](https://wiki.archiveteam.org/index.php/ImageShack) registra que muitas imagens do serviço foram apagadas em 2014 e classifica o ImageShack como “Not saved yet”. A API de revisões mostra essa classificação nas 17 versões públicas da página desde janeiro de 2011; não foi localizado tracker nem repositório público de resgate dedicado ao serviço. O único conjunto de dados relevante descoberto no Internet Archive foi o independente `4archive`, limitado a links encontrados em material do 4chan de 2014–2015. Seus dois mapas, 44.132.475 bytes comprimidos, foram baixados e os SHA-1 publicados foram confirmados. Os 57.647 arquivos extraídos somavam 196.339.103 bytes; a busca integral pelos seis nomes, IDs públicos e pares servidor/bucket retornou zero correspondências. Esses seis arquivos permanecem, portanto, **identificados mas não recuperados**.

Também foram testadas 72 combinações de uploads do WordPress.com, `skhaz.files.wordpress.com` e caches `i0`/`i1`/`i2.wp.com` para originais e miniaturas conhecidas; nenhuma resposta passou assinatura, MIME e dimensões. Os IDs de mídia 107, 108, 118 e 120 existem, mas a API exige autenticação (`403`) e seus bytes não foram expostos. Dez buscas exatas no Openverse retornaram zero resultados. O manifesto completo é `archive/sources/missing-media-deep-sweep-2026-07-27.json`.

Quando o serviço bruto do Common Crawl voltou a responder, uma continuação exclusiva para `finalor9.png` examinou vinte gramáticas alternativas de URL em todos os 125 índices: páginas históricas `my.php`, `/photo/my-images/`, `/f/` e `/i/`; caminhos `/a/img…`; o ID `79finalor9p` em `imageshack.us`, `imageshack.com` e `yfrog.com`; e quatro rotas Imagizer plausíveis. Foram realizadas 2.500 buscas binárias e descompactados 1.863 blocos CDX — 309.375.277 bytes comprimidos e 2.359.818.481 bytes expandidos — sem uma linha contendo o nome ou ID. O resultado continua limitado às vinte variantes e ao inventário consultado; o manifesto reproduzível é `archive/sources/commoncrawl-finalor9-aliases-2026-07-27.json`. A validação local fixa o manifesto por hash, deriva sua aritmética e vincula cada índice ao inventário anterior, mas não republica os 309 MB de blocos: uma auditoria independente da busca negativa deve refazer os ranges documentados.

### Capturas do instalador Boost

As imagens `boostconfig1.png` e `boostinstaller2.png` eram uploads locais do WordPress, não arquivos do site do fornecedor. Consultas exatas na Wayback Machine e no Arquivo.pt não retornaram capturas dos originais; consultas Wayback bem-sucedidas para as variantes `-300x234.png` também retornaram listas vazias. Páginas contemporâneas da Boost Consulting e da BoostPro confirmam o instalador BoostPro 1.35, suas opções e o link `boost_1_35_0_setup.exe`, mas não contêm as duas capturas do autor. Nenhuma imagem de outro tutorial foi usada como substituta.

Uma captura exata do executável no hostname posterior do mesmo fornecedor foi localizada em `20081113215056`: `http://www.boostpro.com/boost_1_35_0_setup.exe`. O payload de 191.672 bytes é um PE32/NSIS para Windows; SHA-1 `9ce20a42677120ce5d70f5b6f7aec1114f80a828`, idêntico ao digest Base32 do CDX, e SHA-256 `a450ec3449f701a6a97584cb6c1c04bf3ee87d5694ed7fff29a216fd1d1b9946`. A análise foi estritamente estática e o programa não foi executado. A URL exata em `boost-consulting.com` usada pelo post não possui captura 200, portanto a relação entre hostnames é registrada como linhagem forte do fornecedor, não como prova de bytes idênticos. O executável de terceiro não é republicado, não conta como um dos três ZIPs autorais ausentes e não substitui os screenshots. Evidência: `archive/sources/boostpro-1.35-installer-2026-07-27.json`.

As URLs, status, tipos, tamanhos, hashes integrais das respostas e resultados de validação binária dessa rodada estão preservados em `archive/sources/recovery-attempts-2026-07-27.json`. Respostas transitórias `503`/`504` também foram mantidas; novas tentativas bem-sucedidas e vazias foram registradas separadamente, sem transformar indisponibilidade temporária em prova de ausência.

### Código-fonte nos posts

Os 38 blocos C++ são transformados somente durante o build. `content/posts.json` continua preservando o HTML recuperado, enquanto a apresentação gerada remove os antigos `<span style>`, decodifica as camadas de entidades comprovadamente introduzidas pelo HTML (`&amp;amp;` → `&`) e aplica realce estático com Highlight.js. Não há parser ou biblioteca de realce no navegador.

A indentação é refeita com quatro espaços a partir de chaves, rótulos de acesso, `case` e continuações simples. Essa normalização é apenas visual e não altera o corpus arquivado. Fragmentos historicamente corrompidos como `boost /function.hpp`, `</boost><boost /bind.hpp>` e `shared_ptr</task><task>` são mantidos literalmente: sem um ZIP ou snapshot contemporâneo do fonte, “corrigi-los” seria inventar código. Cada bloco oferece cópia do texto exatamente exibido depois dessa normalização conservadora.

Uma medição intercalou quinze builds aquecidos com o commit-base `6cbad9c`. Depois de reutilizar formatadores de data em vez de recriá-los para cada cartão, a mediana passou de 143,592 ms para 114,231 ms (**−29,361 ms; −20,45%**), mesmo incluindo o realce. Nos 11 posts afetados, o HTML cresceu 35.235 bytes bruto e 3.366 bytes ao comprimir cada página com gzip nível 9; em todo `dist/`, o acréscimo foi 38.883 bytes bruto e 4.486 bytes gzip. CSS e JavaScript somaram, respectivamente, +536 e +584 bytes gzip. Não há custo de parsing do Highlight.js no navegador. Ambiente, amostras, caminhos e método estão em `archive/sources/highlighting-performance-2026-07-27.json`; os totais gzip são comparativos, não uma previsão exata do servidor HTTP.

A importação deduplicada do WordPress.com recebeu uma medição própria, com 31 builds aquecidos e intercalados por revisão. Depois de incorporar a contagem posterior de “ONE”, agregar tags que diferem apenas por caixa e agrupar em paralelo a escrita das páginas independentes, a mediana passou de 126,869 ms para 121,281 ms (**−5,588 ms; −4,40%**), e a média também caiu de 135,474 ms para 122,270 ms. O `dist/` ganhou dois arquivos: o índice de origens e o PNG original do Arret; o acréscimo gzip de 182.337 bytes é quase todo o próprio artefato histórico, não código executável. Método, amostras, tamanhos e hash da árvore gerada estão em `archive/sources/wordpress-origin-import-performance-2026-07-27.json`.

## Segurança do material histórico

Uma captura Common Crawl de 2010 continha JavaScript ofuscado injetado após o fechamento do `<head>`, apontando para um domínio externo. A restauração extraiu apenas o corpo semântico de cada post e comentário. Foram removidos:

- scripts, iframes desconhecidos e rastreadores;
- formulários de comentário e endpoints do WordPress;
- publicidade e páginas de estacionamento;
- plugins de votação, analytics e social bookmarking;
- qualquer `javascript:` vindo do HTML histórico.

Os dois embeds preservados são vídeos do YouTube, convertidos dos antigos objetos Flash para `youtube-nocookie.com`.

## Integridade e lacunas

Imagens só foram incorporadas quando o arquivo original ainda estava disponível e sua assinatura binária era válida. Imagens do ImageShack e alguns uploads locais não apareceram nas consultas Wayback/Arquivo.pt, nos 125 índices Common Crawl anunciados em 27/07/2026, nas rotas públicas do WordPress.com/Photon nem nas rotas atuais do ImageShack/Imagizer que foram testadas. O perfil do ImageShack ainda identifica seis delas, mas já não entrega seus bytes. Nesses onze pontos, o site mostra **“Imagem histórica não recuperada”**. Três downloads também são marcados como indisponíveis.

Buscas exatas em repositórios públicos do autor, árvores e histórico alcançável do GitHub, Openverse, páginas de fornecedores e mirrors públicos não produziram candidato com proveniência suficiente. A continuação consultou também os projetos públicos atribuíveis no GitLab, Bitbucket e SourceForge: nenhum alvo apareceu nas listas ou árvores atuais alcançáveis. Um agregador MemGator foi executado para as 22 URLs exatas contra sua configuração preservada de 13 arquivos ativos e não relatou mementos. Como o BAnQ falhou em todas as consultas e a Wayback falhou em duas, esse zero não é apresentado como resposta completa de todos os acervos; LOC, Stanford, UK Web Archive e outros endpoints com bloqueio ou indisponibilidade continuam inconclusivos.

Resultados genéricos e imagens apenas semelhantes foram rejeitados. O manifesto dessa continuação é `archive/sources/missing-media-continuation-2026-07-27.json`. As negativas permanecem delimitadas: export autenticado do WordPress.com/ImageShack, backups pessoais, caches locais, objetos Git inalcançáveis, contêineres não indexados e coleções privadas ou inacessíveis ainda poderiam conter bytes.

As capturas registram onze comentários cujos corpos não sobreviveram. A diferença adicional vem de “ONE”: a página inicial do WordPress.com em setembro de 2008 registra dois comentários, mas apenas um corpo foi localizado. O site preserva as contagens sem fabricar autores ou mensagens. O post `boost-136` é exibido como fragmento e termina com uma nota explícita sobre a parte ausente.

Não foram corrigidas grafia, gramática, afirmações técnicas ou linguagem de época: esses elementos fazem parte do documento histórico. Comentários ofensivos também não foram reescritos; são apresentados como arquivo, com o contexto e a data originais.

## Identidade visual

O site usou diferentes temas ao longo de 2008. As páginas de 2009 usam iNove, por isso a restauração adota essa última identidade verificável — cabeçalho escuro, navegação clara, conteúdo em duas colunas e tipografia compacta — com adaptações atuais de responsividade, foco por teclado, HTML semântico e impressão.

Os arquivos artísticos derivados do iNove são GPL-2.0. Consulte `public/assets/theme/LICENSE-iNove.txt` e `THIRD_PARTY_NOTICES.md`.

## Critério de conclusão

```bash
npm test
```

A validação exige 35 posts canônicos sem duplicação, 15 origens WordPress.com associadas a esses mesmos posts, 1 aviso predecessor separado, 72 comentários integrais de 83 registrados, captura específica para cada post, 11 lacunas de imagem, 3 downloads ausentes, 38 blocos C++ destacados estaticamente, os manifestos forenses íntegros, feeds históricos, ausência de scripts antigos e inexistência de links locais quebrados no site gerado.
