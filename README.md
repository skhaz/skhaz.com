# skhaz.com — blog restaurado

Restauração estática do blog original de **Rodrigo “Skhaz” Delduca**, publicado em `skhaz.com/blog` entre 2008 e 2009.

## Resultado

- 35 posts e 2 páginas de apoio preservados nas rotas históricas;
- 15 desses posts confirmados também nas capturas do antecessor `skhaz.wordpress.com`, unidos aos registros canônicos sem duplicação;
- 1 aviso de migração exclusivo do WordPress.com, mantido em seção separada;
- 72 comentários integrais recuperados de 83 registrados nas capturas;
- categorias, tags, arquivos mensais, índice pesquisável, RSS e sitemap;
- 38 blocos C++ com realce estático, indentação consistente de quatro espaços e cópia rápida;
- imagens recuperadas localmente sempre que uma fonte confiável ainda existia;
- 11 imagens (6 identificadas por metadados), 3 downloads, 11 comentários e o fim de 1 post não recuperados, sempre marcados sem conteúdo inventado;
- visual inspirado no iNove, o último tema observado no blog.

## Executar

Requer Node.js 20 ou superior. O build instala `highlight.js` como dependência local; nenhuma biblioteca de realce é enviada ao navegador.

```bash
npm run dev
```

Abra <http://127.0.0.1:4173/skhaz.com/blog/>.

## Validar e gerar

```bash
npm test       # gera o site e valida conteúdo, rotas e assets
npm run build  # gera somente dist/
```

O diretório `dist/` é um site estático. A URL canônica é <https://skhaz.github.io/skhaz.com/>.

## Publicar no GitHub Pages

O workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) valida, gera e publica `dist/` automaticamente a cada push em `main` ou `master`.

O repositório público é `github.com/skhaz/skhaz.com`, com **Source: GitHub Actions**. O deploy mantém o site em <https://skhaz.github.io/skhaz.com/> sem domínio customizado. Tanto a raiz do projeto quanto `/skhaz.com/blog/` entregam o arquivo navegável completo.

## Fontes históricas

- Internet Archive / Wayback Machine — 29 posts integrais, 1 post parcial, índice, páginas e comentários de 2008;
- Common Crawl — cinco posts e comentários de dezembro de 2008 a abril de 2009; os 125 índices anunciados também foram examinados em uma busca binária independente pelas mídias e ZIPs ausentes;
- `skhaz.wordpress.com` — 15 origens de posts confirmadas pela Wayback Machine, sem duplicar o corpus; mídias originais ainda disponíveis e o aviso histórico que anunciou `www.skhaz.com`;
- perfil público do ImageShack — metadados forenses de seis imagens ausentes, sem os binários;
- repositório público do tema iNove — identidade visual da fase final.

A metodologia, as limitações e o inventário das fontes estão em [`docs/RESTORATION.md`](docs/RESTORATION.md). Os artefatos de pesquisa preservados ficam em [`archive/sources/`](archive/sources/), e cada entrada de [`content/posts.json`](content/posts.json) carrega sua própria proveniência.
