# Fontes arquivísticas preservadas

Estes arquivos são evidência de pesquisa, não conteúdo pronto para publicação. Capturas HTML podem conter scripts, rastreadores ou injeções históricas e **nunca devem ser copiadas diretamente para `dist/`**. O site é gerado somente a partir do conteúdo sanitizado em `content/`.

## Wayback Machine

| Arquivo | Origem principal |
| --- | --- |
| `wayback-cdx.json` | índice CDX usado na enumeração de `www.skhaz.com` |
| `wayback-feed-cdx-2008.json` | CDX de `feeds.feedburner.com/skhazblog` |
| `wayback-feed-2008.xml` | `20080528143819id_/http://feeds.feedburner.com/skhazblog` |
| `wayback-post-index-2008.html` | índice histórico “Lista de Posts” |
| `wayback-privacy-2008.txt` | `20080528081831` — `/blog/politica-de-privacidade/` |
| `wayback-home-2008-07.html` | `20080705192754id_/http://www.skhaz.com/blog/` |
| `wayback-home-2008-09.html` | `20080923160108id_/http://www.skhaz.com/blog/` |
| `wayback-wordpress-god-2008.html` | `20080703055748` — `/blog/wordpress-god/` |
| `wayback-wordpress-com-cdx-2008.json` | CDX da página inicial de `skhaz.wordpress.com` em 2008 |
| `wayback-wordpress-com-home-2008-04.html` | `20080409155551id_/http://skhaz.wordpress.com/` |

A captura WordPress.com de abril preserva a versão contemporânea de “Mudando de casa”, que anunciava `http://www.skhaz.com/`. Ela prevalece sobre a revisão pública alterada em 2012.

## Fontes públicas atuais

| Arquivo | Endpoint consultado em 26/07/2026 | Uso |
| --- | --- | --- |
| `imageshack-profile-2026-07-26.json` | `https://imageshack.com/rest_api/v2/user/skhaz/images?limit=100&offset=0` | metadados de 49 uploads; os seis binários referenciados continuam ausentes |
| `wordpress-mudando-de-casa-2026-07-26.json` | `https://public-api.wordpress.com/rest/v1.1/sites/2393109/posts/59` | identidade e revisão atual do post 59 |
| `wordpress-mudando-de-casa-replies-2026-07-26.json` | `https://public-api.wordpress.com/rest/v1.1/sites/2393109/posts/59/replies/` | confirmação estruturada de zero comentários |
| `recovery-attempts-2026-07-27.json` | ImageShack, Wayback CDX, Arquivo.pt e Internet Archive | primeiro manifesto de URLs, status, tipos, tamanhos, hashes de resposta e validação binária das tentativas negativas |
| `missing-media-deep-sweep-2026-07-27.json` | ImageShack/Imagizer, WordPress.com, Photon e Openverse | 54 rotas ImageShack, 72 rotas WordPress/CDN, 4 IDs de mídia protegidos por autenticação e 10 consultas Openverse; nenhum binário válido |
| `commoncrawl-collections-2026-07-27.html` | `https://data.commoncrawl.org/cc-index/collections/index.html` | inventário bruto que anunciou 125 índices no momento da busca; SHA-256 `6a0a3483…eb964` |
| `commoncrawl-missing-assets-raw-index-2026-07-27.json` | `data.commoncrawl.org`, 2008–2015 | busca forense nos 23 primeiros índices: 506 consultas, 99 blocos CDX e dois ARC completos; zero localizadores dos alvos |
| `commoncrawl-missing-assets-remaining-indexes-2026-07-27.json` | `data.commoncrawl.org`, 2016–2026 | continuação nos outros 102 índices anunciados: 2.244 consultas, 624 blocos CDX, zero localizadores e zero erros |
| `boostpro-1.35-installer-2026-07-27.json` | Wayback, Boost Consulting e BoostPro | verificação estática do instalador contemporâneo do fornecedor; o executável não é republicado e não substitui as capturas do autor |
| `highlighting-performance-2026-07-27.json` | builds locais antes/depois | quinze amostras aquecidas e intercaladas, tamanhos brutos e gzip do site, dos 11 posts afetados, do CSS e do JavaScript |

Os dois manifestos Common Crawl cobrem, juntos, os 125 índices anunciados no inventário preservado em 27/07/2026: 2.750 buscas por 22 prefixos SURT, 15.980.084.528 bytes de `cluster.idx` examinados e 117.492.051 bytes de blocos CDX baixados e descompactados, sem linha correspondente. Esse resultado é uma negativa limitada ao inventário e aos prefixos documentados, não uma prova de inexistência global nem uma afirmação sobre índices futuros.

Metadados não substituem mídia. Um arquivo só é considerado recuperado depois de validar bytes, assinatura, MIME e dimensões coerentes. Para ZIPs, também são exigidas assinatura e integridade do diretório central. O executável de terceiro foi identificado e analisado sem execução, mas não é contado entre os três downloads autorais ausentes.
