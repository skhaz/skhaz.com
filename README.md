# skhaz.com — blog restaurado

Restauração estática do blog original de **Rodrigo “Skhaz” Delduca**, publicado em `skhaz.com/blog` entre 2008 e 2009.

## Resultado

- 35 posts e 2 páginas de apoio preservados nas rotas históricas;
- 72 comentários integrais recuperados de 82 registrados nas capturas;
- categorias, tags, arquivos mensais, índice pesquisável, RSS e sitemap;
- imagens recuperadas localmente sempre que uma fonte confiável ainda existia;
- 11 imagens, 3 downloads, 10 comentários e o fim de 1 post não recuperados, sempre marcados sem conteúdo inventado;
- visual inspirado no iNove, o último tema observado no blog.

## Executar

Requer Node.js 20 ou superior e não possui dependências externas.

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
- Common Crawl — cinco posts e comentários de dezembro de 2008 a abril de 2009;
- `skhaz.wordpress.com` — mídias originais ainda disponíveis;
- repositório público do tema iNove — identidade visual da fase final.

A metodologia, as limitações e o inventário das fontes estão em [`docs/RESTORATION.md`](docs/RESTORATION.md). Os artefatos de pesquisa preservados ficam em [`archive/sources/`](archive/sources/), e cada entrada de [`content/posts.json`](content/posts.json) carrega sua própria proveniência.
