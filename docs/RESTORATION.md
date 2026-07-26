# Restauração do blog skhaz.com

## Escopo recuperado

O blog genuíno esteve disponível em `http://www.skhaz.com/blog/`. A captura mais antiga encontrada é de abril de 2008; o conteúdo migrado começa em 4 de fevereiro de 2008. A última publicação encontrada é de 9 de abril de 2009. Capturas posteriores do domínio mostram estacionamento e páginas de venda, portanto foram descartadas.

| Item | Recuperado |
| --- | ---: |
| Posts | 35 (34 integrais e 1 parcial) |
| Páginas de apoio | 2 (`Lista de Posts` e `Política de Privacidade`) |
| Comentários | 72 integrais de 82 registrados |
| Período | 04/02/2008–09/04/2009 |
| Imagens locais | 24 |
| Imagens não localizadas | 11 posições |
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
| iNove, por mg12 | repositório público GPL-2.0 | adaptar | Arte da última identidade visual observada |
| `skhaz/nullonerror` e `nullonerror-posts` | GitHub | não misturar | Continuação editorial em outro domínio e outro período |

**Decisão:** construir uma versão estática nova, porque o WordPress original e seu banco não estão disponíveis. O HTML histórico é preservado como conteúdo, mas scripts e plugins antigos não são reativados.

## Descoberta

### Wayback Machine

O CDX retornou 269 registros para `www.skhaz.com/*`, dos quais 190 tinham status 200. O blog aparece em 2008; a partir de 2011, o domínio já exibia uma página de estacionamento. O RSS capturado contém 22 itens completos, e o índice “Lista de Posts” confirma títulos, datas e contagens de comentários. Capturas posteriores da página inicial revelaram outros oito posts: sete corpos integrais entre maio e julho e um trecho parcial em setembro. A página `Política de Privacidade` também foi preservada na URL histórica.

Os posts adicionais são `deque-shared_ptr-for_each-mem_fun-cabummm`, `agendamento-de-tarefas`, `instalador-da-boost`, `os-10-ultimos-mais-usados-comandos-no-linux`, `7-habits-for-effective-text-editing-20`, `wordpress-god`, `ctrlc-e-ctrlv` e `boost-136`. A captura não informa o dia exato de `7-habits-for-effective-text-editing-20`; para `boost-136`, preserva apenas a introdução e comprova que já estava publicado em 23/09/2008.

Artefatos preservados:

- `archive/sources/wayback-cdx.json`
- `archive/sources/wayback-feed-2008.xml`
- `archive/sources/wayback-post-index-2008.html`
- `archive/sources/wayback-privacy-2008.txt`
- `archive/sources/wayback-home-2008-07.html`
- `archive/sources/wayback-home-2008-09.html`
- `archive/sources/wayback-wordpress-god-2008.html`

### Common Crawl

Os índices `CC-MAIN-2009-2010` e `CC-MAIN-2012` revelaram cinco URLs adicionais:

1. `por-onde-andas-skhaz` — 10/12/2008;
2. `qt-agora-e-lgpl` — 14/01/2009;
3. `meme-aleatoriedades` — 05/02/2009;
4. `hoje-sexta-feira-13-o-unix-time-chegara-ao-valor-1234567890` — 13/02/2009;
5. `maquina-do-tempo-com-o-vim` — 09/04/2009.

Os registros ARC foram lidos diretamente por `filename`, `offset` e `length`. Esses metadados permanecem no campo `source.record` de cada post recuperado.

## Segurança do material histórico

Uma captura Common Crawl de 2010 continha JavaScript ofuscado injetado após o fechamento do `<head>`, apontando para um domínio externo. A restauração extraiu apenas o corpo semântico de cada post e comentário. Foram removidos:

- scripts, iframes desconhecidos e rastreadores;
- formulários de comentário e endpoints do WordPress;
- publicidade e páginas de estacionamento;
- plugins de votação, analytics e social bookmarking;
- qualquer `javascript:` vindo do HTML histórico.

Os dois embeds preservados são vídeos do YouTube, convertidos dos antigos objetos Flash para `youtube-nocookie.com`.

## Integridade e lacunas

Imagens só foram incorporadas quando o arquivo original ainda estava disponível e sua assinatura binária era válida. Imagens do Imageshack e alguns uploads locais não apareceram na Wayback, no Common Crawl nem no WordPress.com. Nesses onze pontos, o site mostra **“Imagem histórica não recuperada”**. Três downloads também são marcados como indisponíveis.

As capturas registram dez comentários cujos corpos não sobreviveram. O site preserva suas contagens sem fabricar autores ou mensagens. O post `boost-136` é exibido como fragmento e termina com uma nota explícita sobre a parte ausente.

Não foram corrigidas grafia, gramática, afirmações técnicas ou linguagem de época: esses elementos fazem parte do documento histórico. Comentários ofensivos também não foram reescritos; são apresentados como arquivo, com o contexto e a data originais.

## Identidade visual

O site usou diferentes temas ao longo de 2008. As páginas de 2009 usam iNove, por isso a restauração adota essa última identidade verificável — cabeçalho escuro, navegação clara, conteúdo em duas colunas e tipografia compacta — com adaptações atuais de responsividade, foco por teclado, HTML semântico e impressão.

Os arquivos artísticos derivados do iNove são GPL-2.0. Consulte `public/assets/theme/LICENSE-iNove.txt` e `THIRD_PARTY_NOTICES.md`.

## Critério de conclusão

```bash
npm test
```

A validação exige 35 posts, 72 comentários integrais de 82 registrados, proveniência por post, 11 lacunas de imagem, 3 downloads ausentes, feeds históricos, ausência de scripts antigos e inexistência de links locais quebrados no site gerado.
