# Restauração do blog skhaz.com

## Escopo recuperado

O blog genuíno esteve disponível em `http://www.skhaz.com/blog/`. A captura mais antiga encontrada é de abril de 2008; o conteúdo migrado começa em 4 de fevereiro de 2008. A última publicação encontrada é de 9 de abril de 2009. Capturas posteriores do domínio mostram estacionamento e páginas de venda, portanto foram descartadas.

| Item | Recuperado |
| --- | ---: |
| Posts | 35 (34 integrais e 1 parcial) |
| Páginas de apoio | 2 (`Lista de Posts` e `Política de Privacidade`) |
| Fase predecessora | 1 aviso de migração do WordPress.com, preservado separadamente |
| Comentários | 72 integrais de 82 registrados |
| Período | 04/02/2008–09/04/2009 |
| Imagens locais | 24 |
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
| `skhaz.wordpress.com` | WordPress.com | compor | 24 arquivos de mídia ainda disponíveis na origem |
| Página inicial do WordPress.com de 09/04/2008 | Wayback Machine | preservar separadamente | Aviso contemporâneo que anunciou a mudança para `www.skhaz.com` |
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

A página inicial de `skhaz.wordpress.com` capturada em `20080409155551`, um dia após a publicação, preserva o aviso **“Mudando de casa”** com o texto completo anunciando `http://www.skhaz.com/`. O registro informa data de 8 de abril de 2008, categoria C++ e nenhum comentário. Como esse aviso nunca foi comprovado sob `/blog/`, ele é publicado em `/arquivo/skhaz-wordpress-com/2008/04/08/mudando-de-casa/`, fora dos 35 posts do corpus principal.

A API pública atual do WordPress.com identifica o mesmo objeto como site `2393109`, post `59`, mas registra uma modificação em `2012-02-23T22:26:25Z` e hoje mostra outro texto apontando para NULL on error. Essa revisão posterior foi preservada apenas como evidência da mutação: não substitui a captura contemporânea e não traz o conteúdo posterior de NULL on error para este arquivo.

Artefatos preservados:

- `archive/sources/wayback-wordpress-com-cdx-2008.json`
- `archive/sources/wayback-wordpress-com-home-2008-04.html`
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

Os IDs continuam resolvendo para páginas e JSON de metadados, mas nenhuma rota testada entregou bytes de imagem: originais, miniaturas e Imagizer retornaram `404 text/html` de 168 bytes; as páginas `/i/{id}/download` redirecionaram à home em HTML; e `/download/{id}` terminou em `200 application/octet-stream` com corpo vazio. A [documentação do ArchiveTeam](https://wiki.archiveteam.org/index.php/ImageShack) registra que muitas imagens do serviço foram apagadas em 2014 e classifica o ImageShack como “Not saved yet”; a coleção pública do ArchiveTeam no Internet Archive não apresentou um conjunto ImageShack recuperável. Esses seis arquivos permanecem, portanto, **identificados mas não recuperados**.

### Capturas do instalador Boost

As imagens `boostconfig1.png` e `boostinstaller2.png` eram uploads locais do WordPress, não arquivos do site do fornecedor. Consultas exatas na Wayback Machine e no Arquivo.pt não retornaram capturas dos originais; consultas Wayback bem-sucedidas para as variantes `-300x234.png` também retornaram listas vazias. Páginas contemporâneas da Boost Consulting confirmam o instalador BoostPro 1.35, suas opções e o link `boost_1_35_0_setup.exe`, mas não contêm as duas capturas do autor. O executável histórico tampouco foi localizado em captura verificável. Nenhuma imagem de outro tutorial foi usada como substituta.

As URLs, status, tipos, tamanhos, hashes integrais das respostas e resultados de validação binária dessa rodada estão preservados em `archive/sources/recovery-attempts-2026-07-27.json`. Respostas transitórias `503`/`504` também foram mantidas; novas tentativas bem-sucedidas e vazias foram registradas separadamente, sem transformar indisponibilidade temporária em prova de ausência.

## Segurança do material histórico

Uma captura Common Crawl de 2010 continha JavaScript ofuscado injetado após o fechamento do `<head>`, apontando para um domínio externo. A restauração extraiu apenas o corpo semântico de cada post e comentário. Foram removidos:

- scripts, iframes desconhecidos e rastreadores;
- formulários de comentário e endpoints do WordPress;
- publicidade e páginas de estacionamento;
- plugins de votação, analytics e social bookmarking;
- qualquer `javascript:` vindo do HTML histórico.

Os dois embeds preservados são vídeos do YouTube, convertidos dos antigos objetos Flash para `youtube-nocookie.com`.

## Integridade e lacunas

Imagens só foram incorporadas quando o arquivo original ainda estava disponível e sua assinatura binária era válida. Imagens do ImageShack e alguns uploads locais não apareceram na Wayback, no Common Crawl nem no WordPress.com. O perfil do ImageShack ainda identifica seis delas, mas já não entrega seus bytes. Nesses onze pontos, o site mostra **“Imagem histórica não recuperada”**. Três downloads também são marcados como indisponíveis.

As capturas registram dez comentários cujos corpos não sobreviveram. O site preserva suas contagens sem fabricar autores ou mensagens. O post `boost-136` é exibido como fragmento e termina com uma nota explícita sobre a parte ausente.

Não foram corrigidas grafia, gramática, afirmações técnicas ou linguagem de época: esses elementos fazem parte do documento histórico. Comentários ofensivos também não foram reescritos; são apresentados como arquivo, com o contexto e a data originais.

## Identidade visual

O site usou diferentes temas ao longo de 2008. As páginas de 2009 usam iNove, por isso a restauração adota essa última identidade verificável — cabeçalho escuro, navegação clara, conteúdo em duas colunas e tipografia compacta — com adaptações atuais de responsividade, foco por teclado, HTML semântico e impressão.

Os arquivos artísticos derivados do iNove são GPL-2.0. Consulte `public/assets/theme/LICENSE-iNove.txt` e `THIRD_PARTY_NOTICES.md`.

## Critério de conclusão

```bash
npm test
```

A validação exige 35 posts, 1 aviso predecessor separado, 72 comentários integrais de 82 registrados, captura específica para cada post, 11 lacunas de imagem, 3 downloads ausentes, feeds históricos, ausência de scripts antigos e inexistência de links locais quebrados no site gerado.
