import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	enhanceCodeBlocks,
	getHighlightedCodeBlockCount,
} from "./code-presentation.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITE_ORIGIN = "https://skhaz.github.io";
const BASE_PATH = "/skhaz.com";
const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;
const PAGE_SIZE = 10;

const loadContentCollection = async (filename, label) => {
	try {
		const parsed = JSON.parse(
			await readFile(path.join(ROOT, "content", filename), "utf8"),
		);
		if (!Array.isArray(parsed) || parsed.length === 0) {
			throw new TypeError(`${filename} must contain a non-empty array`);
		}
		return parsed;
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(`Unable to load ${label}: ${reason}`, {
			cause: error,
		});
	}
};

const sourcePosts = await loadContentCollection(
	"posts.json",
	"the restored posts",
);
const predecessorPosts = await loadContentCollection(
	"predecessor-posts.json",
	"the predecessor-site records",
);
const migrationPost = predecessorPosts.find(
	(post) => post.id === "wordpress-com-59",
);
if (!migrationPost) {
	throw new Error("Missing the verified WordPress.com migration record");
}
const migrationRoute =
	"/arquivo/skhaz-wordpress-com/2008/04/08/mudando-de-casa/";
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await cp(path.join(ROOT, "public"), DIST, { recursive: true });

const HTML_ENTITIES = Object.freeze({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
});
const escapeHtml = (value = "") =>
	String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);

const stripTags = (value = "") =>
	value
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();

const posts = sourcePosts.map((post) => ({
	...post,
	presentationHtml: enhanceCodeBlocks(post.html, post.slug),
}));

const slugify = (value) => {
	if (value.toLowerCase() === "c++") return "cpp";
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/\+/g, "p")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
};

const isFullDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});
const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
	month: "long",
	timeZone: "UTC",
});
const formattedDates = new Map();
const formattedMonths = new Map();
const formatMonth = (monthKey) => {
	if (formattedMonths.has(monthKey)) return formattedMonths.get(monthKey);
	const [year, month] = monthKey.split("-");
	const label = MONTH_FORMATTER.format(
		new Date(`${year}-${month}-15T12:00:00Z`),
	);
	const formatted = `${label[0].toUpperCase()}${label.slice(1)} ${year}`;
	formattedMonths.set(monthKey, formatted);
	return formatted;
};
const formatDate = (date) => {
	if (formattedDates.has(date)) return formattedDates.get(date);
	const formatted = isFullDate(date)
		? DATE_FORMATTER.format(new Date(`${date}T12:00:00Z`))
		: `${formatMonth(date)} · dia exato não preservado`;
	formattedDates.set(date, formatted);
	return formatted;
};

const countBy = (values) =>
	values.reduce((counts, value) => {
		counts.set(value, (counts.get(value) ?? 0) + 1);
		return counts;
	}, new Map());

const categories = [
	...countBy(posts.flatMap((post) => post.categories)).entries(),
].sort(([a], [b]) => a.localeCompare(b, "pt-BR"));
const tags = [...countBy(posts.flatMap((post) => post.tags)).entries()].sort(
	([a], [b]) => a.localeCompare(b, "pt-BR"),
);
const months = [
	...countBy(posts.map((post) => post.date.slice(0, 7))).entries(),
].sort(([a], [b]) => b.localeCompare(a));

const routeToFile = (route) => {
	if (route === "/") return path.join(DIST, "index.html");
	const clean = route.replace(/^\//, "").replace(/\/$/, "");
	return path.join(DIST, clean, "index.html");
};

const writeRoute = async (route, content) => {
	const target = routeToFile(route);
	await mkdir(path.dirname(target), { recursive: true });
	await writeFile(target, content);
};

const absoluteUrl = (route) =>
	new URL(`${BASE_PATH}${route}`, `${SITE_ORIGIN}/`).toString();
const prefixSitePaths = (markup) =>
	markup.replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${BASE_PATH}/`);

const badgeList = (post) =>
	[
		...post.categories.map(
			(category) =>
				`<a class="badge badge-category" href="/blog/category/${slugify(category)}/">${escapeHtml(category)}</a>`,
		),
		...post.tags
			.slice(0, 4)
			.map(
				(tag) =>
					`<a class="badge" href="/blog/tag/${slugify(tag)}/">${escapeHtml(tag)}</a>`,
			),
	].join(" ");

const commentLabel = (count) => `${count} comentário${count === 1 ? "" : "s"}`;
const historicalCommentCount = (post) =>
	post.knownCommentCount ?? post.comments.length;
const cardCommentMeta = (post) => {
	const count = historicalCommentCount(post);
	return count === 0 ? "" : ` · ${commentLabel(count)}`;
};
const restorationGapsNote = (post) => {
	const notes = [];
	if (post.partialContent) {
		notes.push(
			"a captura preservou somente o trecho exibido na página inicial; o restante do texto não foi localizado",
		);
	}
	if (post.missingMedia.length > 0) {
		const count = post.missingMedia.length;
		notes.push(
			`${count} ${count === 1 ? "imagem não foi recuperada" : "imagens não foram recuperadas"}`,
		);
	}
	if ((post.missingDownloads ?? []).length > 0) {
		const count = post.missingDownloads.length;
		notes.push(
			`${count} ${count === 1 ? "download não foi recuperado" : "downloads não foram recuperados"}`,
		);
	}
	if (notes.length === 0) return "";
	return `<aside class="media-note" aria-label="Nota de restauração"><strong>Nota de restauração:</strong> ${escapeHtml(notes.join("; "))}.</aside>`;
};

const sidebar = () => `
  <aside class="sidebar" aria-label="Navegação do arquivo">
    <section class="widget archive-note">
      <h2>Arquivo restaurado</h2>
      <p><strong>${posts.length} textos</strong> publicados entre fevereiro de 2008 e abril de 2009, recuperados de cópias históricas.</p>
      <a class="text-link" href="/blog/sobre/">Como este blog foi restaurado →</a>
    </section>
    <section class="widget">
      <h2>Pesquisar</h2>
      <form class="sidebar-search" action="/blog/lista-de-posts/" method="get">
        <label class="sr-only" for="sidebar-q">Pesquisar no blog</label>
        <input id="sidebar-q" type="search" name="q" placeholder="C++, Qt, Vim…" autocomplete="off">
        <button type="submit" aria-label="Pesquisar">⌕</button>
      </form>
    </section>
    <section class="widget">
      <h2>Arquivo</h2>
      <ul class="count-list">
        ${months.map(([month, count]) => `<li><a href="/blog/${month.replace("-", "/")}/">${escapeHtml(formatMonth(month))}</a><span>${count}</span></li>`).join("")}
      </ul>
    </section>
    <section class="widget">
      <h2>Categorias</h2>
      <ul class="count-list">
        ${categories.map(([category, count]) => `<li><a href="/blog/category/${slugify(category)}/">${escapeHtml(category)}</a><span>${count}</span></li>`).join("")}
      </ul>
    </section>
    <section class="widget">
      <h2>Continuidades</h2>
      <ul class="link-list">
        <li><a href="https://nullonerror.org/" rel="external noopener">NULL on error</a></li>
        <li><a href="https://github.com/skhaz" rel="external noopener">github.com/skhaz</a></li>
      </ul>
    </section>
  </aside>`;

const layout = ({
	title,
	description,
	route,
	content,
	bodyClass = "",
	noIndex = false,
}) => {
	const fullTitle =
		title === "skhaz's blog" ? title : `${title} — skhaz's blog`;
	const canonical = absoluteUrl(route);
	return prefixSitePaths(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${noIndex ? '<meta name="robots" content="noindex">' : ""}
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="alternate" type="application/rss+xml" title="skhaz's blog" href="/blog/feed.xml">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:site_name" content="skhaz's blog">
  <link rel="stylesheet" href="/assets/style.css">
  <script defer src="/assets/app.js"></script>
</head>
<body class="${escapeHtml(bodyClass)}">
  <a class="skip-link" href="#main">Pular para o conteúdo</a>
  <div class="site-light">
    <div class="site-shell">
      <header class="site-header">
        <div class="brand">
          <a href="/blog/" aria-label="Página inicial do skhaz's blog">skhaz's blog</a>
          <span>code::blog</span>
        </div>
      </header>
      <nav class="site-nav" aria-label="Principal">
        <a href="/blog/">Início</a>
        <a href="/blog/lista-de-posts/">Todos os posts</a>
        <a href="/blog/sobre/">Sobre o arquivo</a>
        <a href="/blog/feed.xml">RSS</a>
      </nav>
      <div class="content-grid">
        <main id="main" class="main-content">${content}</main>
        ${sidebar()}
      </div>
      <footer class="site-footer">
        <p>skhaz's blog · conteúdo histórico de Rodrigo “Skhaz” Delduca</p>
        <p>Restaurado a partir da <a href="https://web.archive.org/web/*/http://www.skhaz.com/blog/" rel="external noopener">Wayback Machine</a>, <a href="https://commoncrawl.org/" rel="external noopener">Common Crawl</a> e fontes originais · <a href="/blog/politica-de-privacidade/">Política de Privacidade histórica</a>.</p>
      </footer>
    </div>
  </div>
</body>
</html>`);
};

const postCard = (post) => `
  <article class="post-card" data-search-item data-search-text="${escapeHtml([post.title, post.excerpt, ...post.categories, ...post.tags].join(" ").toLowerCase())}">
    <header>
      <h2><a href="/blog/${escapeHtml(post.slug)}/">${escapeHtml(post.title)}</a></h2>
      <p class="post-meta"><time datetime="${post.date}">${escapeHtml(formatDate(post.date))}</time> · SKHAZ${cardCommentMeta(post)}</p>
    </header>
    <p>${escapeHtml(post.excerpt || stripTags(post.html).slice(0, 240))}${post.excerpt.length >= 240 ? "…" : ""}</p>
    <div class="post-card-footer"><span>${badgeList(post)}</span><a class="read-more" href="/blog/${escapeHtml(post.slug)}/">Ler o post →</a></div>
  </article>`;

const pagination = (page, totalPages) => {
	if (totalPages <= 1) return "";
	const href = (target) => (target === 1 ? "/blog/" : `/blog/page/${target}/`);
	return `<nav class="pagination" aria-label="Paginação">
    ${page > 1 ? `<a href="${href(page - 1)}">← Mais recentes</a>` : "<span></span>"}
    <span>Página ${page} de ${totalPages}</span>
    ${page < totalPages ? `<a href="${href(page + 1)}">Mais antigos →</a>` : "<span></span>"}
  </nav>`;
};

const totalRecoveredComments = posts.reduce(
	(sum, post) => sum + post.comments.length,
	0,
);
const totalHistoricalComments = posts.reduce(
	(sum, post) => sum + historicalCommentCount(post),
	0,
);
const totalPages = Math.ceil(posts.length / PAGE_SIZE);
for (let page = 1; page <= totalPages; page += 1) {
	const pagePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const route = page === 1 ? "/blog/" : `/blog/page/${page}/`;
	const intro =
		page === 1
			? `
    <h1 class="sr-only">skhaz's blog — arquivo restaurado de 2008 a 2009</h1>
    <aside class="archive-banner" aria-label="Estado da restauração">
      <strong>Espelho restaurado · 2008—2009</strong>
      <span>${posts.length} posts e ${totalRecoveredComments} comentários integrais preservados.</span>
      <a href="/blog/sobre/">Ver proveniência →</a>
    </aside>`
			: `<header class="page-heading"><p class="eyebrow">Arquivo cronológico</p><h1>Posts — página ${page}</h1></header>`;
	await writeRoute(
		route,
		layout({
			title: page === 1 ? "skhaz's blog" : `Posts — página ${page}`,
			description:
				"Arquivo restaurado do blog de Skhaz sobre C++, Qt, SDL, Vim, jogos e software livre.",
			route,
			content: `${intro}<section class="post-list">${pagePosts.map(postCard).join("")}</section>${pagination(page, totalPages)}`,
			bodyClass: "home-page",
		}),
	);
}

const searchPage = `
  <header class="page-heading">
    <p class="eyebrow">Índice completo</p>
    <h1>Todos os posts</h1>
    <p>Pesquise nos ${posts.length} textos recuperados ou navegue pela cronologia.</p>
  </header>
  <div class="archive-search">
    <label for="archive-q">Pesquisar por título, texto, categoria ou tag</label>
    <input id="archive-q" type="search" placeholder="Digite para filtrar…" data-archive-search autocomplete="off">
    <p class="search-status" aria-live="polite" data-search-status></p>
  </div>
  <section class="compact-post-list">
    ${posts
			.map(
				(
					post,
				) => `<article data-search-item data-search-text="${escapeHtml([post.title, post.excerpt, ...post.categories, ...post.tags].join(" ").toLowerCase())}">
      <time datetime="${post.date}">${post.date.split("-").toReversed().join("/")}</time>
      <div><h2><a href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.categories.join(" · "))}</p></div>
    </article>`,
			)
			.join("")}
  </section>`;
await writeRoute(
	"/blog/lista-de-posts/",
	layout({
		title: "Todos os posts",
		description: `Índice dos ${posts.length} posts recuperados do blog original de Skhaz.`,
		route: "/blog/lista-de-posts/",
		content: searchPage,
		bodyClass: "archive-page",
	}),
);

const commentsHtml = (post) => {
	const missingCount = historicalCommentCount(post) - post.comments.length;
	if (!post.comments.length) {
		if (missingCount > 0) {
			return `<p class="no-comments">A página histórica registra ${commentLabel(missingCount)}, mas o conteúdo ${missingCount === 1 ? "não foi recuperado" : "deles não foi recuperado"}.</p>`;
		}
		return '<p class="no-comments">Nenhum comentário foi registrado ou recuperado para este post.</p>';
	}
	const missingNote =
		missingCount > 0
			? `<p class="no-comments">Além destes, ${commentLabel(missingCount)} ${missingCount === 1 ? "foi registrado, mas não recuperado" : "foram registrados, mas não recuperados"}.</p>`
			: "";
	return `<ol class="comment-list">${post.comments
		.map(
			(comment, index) => `
    <li id="${escapeHtml(comment.id || `comment-${index + 1}`)}">
      <header><span class="comment-avatar" aria-hidden="true">${escapeHtml((comment.author || "?")[0].toUpperCase())}</span><div>
        <strong>${comment.url ? `<a href="${escapeHtml(comment.url)}" rel="external nofollow noopener">${escapeHtml(comment.author)}</a>` : escapeHtml(comment.author)}</strong>
        ${comment.date ? `<time>${escapeHtml(comment.date)}</time>` : ""}
      </div></header>
      <div class="comment-body">${comment.html}</div>
    </li>`,
		)
		.join("")}</ol>${missingNote}`;
};

for (const [index, post] of posts.entries()) {
	const older = posts[index + 1];
	const newer = posts[index - 1];
	const source = post.source;
	const sourceLabel =
		source.archive === "Common Crawl" ? "Common Crawl" : "Wayback Machine";
	const route = `/blog/${post.slug}/`;
	const content = `
    <nav class="breadcrumbs" aria-label="Caminho"><a href="/blog/">Início</a><span>›</span>${post.categories[0] ? `<a href="/blog/category/${slugify(post.categories[0])}/">${escapeHtml(post.categories[0])}</a><span>›</span>` : ""}<span aria-current="page">${escapeHtml(post.title)}</span></nav>
    <article class="single-post">
      <header class="post-header">
        <p class="eyebrow">${post.categories.map(escapeHtml).join(" · ")}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="post-meta"><time datetime="${post.date}">${escapeHtml(formatDate(post.date))}</time> · por SKHAZ</p>
      </header>
      <div class="post-body">${post.presentationHtml || '<p class="restoration-empty">O post original não tinha texto; apenas o título foi publicado.</p>'}</div>
      ${restorationGapsNote(post)}
      <footer class="post-taxonomy">${badgeList(post)}</footer>
      <details class="source-details">
        <summary>Fonte arquivística</summary>
        <p>Conteúdo recuperado via <strong>${sourceLabel}</strong>${source.capturedAt ? `, captura ${escapeHtml(source.capturedAt)}` : ""}.</p>
        ${post.dateNote ? `<p>${escapeHtml(post.dateNote)}</p>` : ""}
        ${source.captureUrl ? `<a href="${escapeHtml(source.captureUrl)}" rel="external nofollow noopener">Abrir registro original ↗</a>` : ""}
      </details>
    </article>
    <nav class="post-navigation" aria-label="Posts adjacentes">
      ${older ? `<a href="/blog/${older.slug}/"><span>← Mais antigo</span><strong>${escapeHtml(older.title)}</strong></a>` : "<span></span>"}
      ${newer ? `<a class="next" href="/blog/${newer.slug}/"><span>Mais recente →</span><strong>${escapeHtml(newer.title)}</strong></a>` : "<span></span>"}
    </nav>
    <section class="comments" aria-labelledby="comments-title">
      <header><p class="eyebrow">Discussão preservada</p><h2 id="comments-title">${commentLabel(historicalCommentCount(post))}</h2></header>
      ${commentsHtml(post)}
    </section>`;
	await writeRoute(
		route,
		layout({
			title: post.title,
			description: post.excerpt || stripTags(post.html).slice(0, 160),
			route,
			content,
			bodyClass: "single-page",
		}),
	);
}

const listingPage = async ({
	route,
	eyebrow,
	title,
	description,
	selectedPosts,
}) => {
	await writeRoute(
		route,
		layout({
			title,
			description,
			route,
			content: `<header class="page-heading"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></header><section class="post-list">${selectedPosts.map(postCard).join("")}</section>`,
			bodyClass: "listing-page",
		}),
	);
};

for (const [category, count] of categories) {
	await listingPage({
		route: `/blog/category/${slugify(category)}/`,
		eyebrow: "Categoria",
		title: category,
		description: `${count} post${count === 1 ? "" : "s"} nesta categoria.`,
		selectedPosts: posts.filter((post) => post.categories.includes(category)),
	});
}
for (const [tag, count] of tags) {
	await listingPage({
		route: `/blog/tag/${slugify(tag)}/`,
		eyebrow: "Tag",
		title: tag,
		description: `${count} post${count === 1 ? "" : "s"} com esta tag.`,
		selectedPosts: posts.filter((post) => post.tags.includes(tag)),
	});
}

const legacyTagAliases = [
	{ route: "/blog/tag/c/", title: "C++", category: "C++" },
	{ route: "/blog/tag/sdl/", title: "SDL", category: "SDL" },
	{ route: "/blog/tag/projetos/", title: "Projetos", category: "Projetos" },
	{ route: "/blog/tag/humor/", title: "Humor", category: "Humor" },
	{ route: "/blog/tag/const_cast/", title: "const_cast", tag: "const_cast" },
	{
		route: "/blog/tag/shared_ptr/",
		title: "shared_ptr",
		tag: "shared_ptr",
		slugs: ["deque-shared_ptr-for_each-mem_fun-cabummm"],
	},
	{
		route: "/blog/tag/deque/",
		title: "deque",
		slugs: ["deque-shared_ptr-for_each-mem_fun-cabummm"],
	},
	{
		route: "/blog/tag/mem_fn/",
		title: "mem_fn",
		slugs: ["deque-shared_ptr-for_each-mem_fun-cabummm"],
	},
	{
		route: "/blog/tag/mem_fun/",
		title: "mem_fun",
		tag: "mem_fun",
		slugs: ["deque-shared_ptr-for_each-mem_fun-cabummm"],
	},
	{
		route: "/blog/tag/thread/",
		title: "Thread",
		slugs: ["agendamento-de-tarefas"],
	},
];
for (const alias of legacyTagAliases) {
	const selectedPosts = posts.filter(
		(post) =>
			(alias.category && post.categories.includes(alias.category)) ||
			(alias.tag && post.tags.includes(alias.tag)) ||
			alias.slugs?.includes(post.slug),
	);
	await listingPage({
		route: alias.route,
		eyebrow: "Tag histórica",
		title: alias.title,
		description: `${selectedPosts.length} posts preservados nesta rota original do WordPress.`,
		selectedPosts,
	});
}
for (const [month, count] of months) {
	await listingPage({
		route: `/blog/${month.replace("-", "/")}/`,
		eyebrow: "Arquivo mensal",
		title: formatMonth(month),
		description: `${count} post${count === 1 ? "" : "s"} publicado${count === 1 ? "" : "s"} neste mês.`,
		selectedPosts: posts.filter((post) => post.date.startsWith(month)),
	});
}

await writeRoute(
	migrationRoute,
	layout({
		title: migrationPost.title,
		description:
			"Aviso histórico que anunciou a migração do blog de skhaz.wordpress.com para skhaz.com em abril de 2008.",
		route: migrationRoute,
		bodyClass: "single-page predecessor-page",
		content: `
    <nav class="breadcrumbs" aria-label="Caminho"><a href="/blog/">Início</a><span>›</span><a href="/blog/sobre/">Sobre o arquivo</a><span>›</span><span aria-current="page">${escapeHtml(migrationPost.title)}</span></nav>
    <article class="single-post">
      <header class="post-header">
        <p class="eyebrow">Fase WordPress.com · aviso de migração</p>
        <h1>${escapeHtml(migrationPost.title)}</h1>
        <p class="post-meta"><time datetime="${migrationPost.date}">${escapeHtml(formatDate(migrationPost.date))}</time> · por ${escapeHtml(migrationPost.author)}</p>
      </header>
      <div class="post-body">${migrationPost.html}</div>
      <aside class="media-note"><strong>Contexto:</strong> este texto foi publicado no antecessor <code>skhaz.wordpress.com</code>, não sob <code>skhaz.com/blog</code>. A captura feita no dia seguinte comprova que ele anunciava a mudança para <code>www.skhaz.com</code>; por isso é preservado separadamente dos 35 posts do corpus principal.</aside>
      <details class="source-details">
        <summary>Fonte arquivística</summary>
        <p>Wayback Machine, captura ${escapeHtml(migrationPost.source.capturedAt)} da página inicial do WordPress.com.</p>
        <p>A versão pública atual foi modificada em 2012 e passou a apontar para outro domínio. O texto acima segue exclusivamente a captura contemporânea de 2008.</p>
        <a href="${escapeHtml(migrationPost.source.captureUrl)}" rel="external nofollow noopener">Abrir captura de 2008 ↗</a><br>
        <a href="${escapeHtml(migrationPost.currentRevision.sourceUrl)}" rel="external nofollow noopener">Abrir registro público atual ↗</a>
      </details>
    </article>
    <section class="comments" aria-labelledby="predecessor-comments-title">
      <header><p class="eyebrow">Discussão preservada</p><h2 id="predecessor-comments-title">0 comentários</h2></header>
      <p class="no-comments">A captura histórica e o registro atual concordam que nenhum comentário foi publicado neste aviso.</p>
    </section>`,
	}),
);

await writeRoute(
	"/blog/sobre/",
	layout({
		title: "Sobre a restauração",
		description:
			"Metodologia e fontes usadas para restaurar o blog histórico de Skhaz.",
		route: "/blog/sobre/",
		bodyClass: "about-page",
		content: `
    <header class="page-heading"><p class="eyebrow">Memória digital</p><h1>Sobre a restauração</h1><p>Esta é uma reconstrução estática do blog publicado originalmente em <strong>skhaz.com/blog</strong>.</p></header>
    <article class="prose restoration-story">
      <h2>O que voltou</h2>
      <ul><li><strong>${posts.length} posts</strong>, de 4 de fevereiro de 2008 a 9 de abril de 2009;</li><li><strong>${totalRecoveredComments} comentários integrais</strong> preservados de ${totalHistoricalComments} registrados nas capturas;</li><li><strong>1 aviso de migração</strong> do antecessor WordPress.com, preservado fora do corpus principal;</li><li>URLs originais, páginas de apoio, categorias, tags, RSS, arquivo mensal e parte das imagens;</li><li>a identidade visual da última fase do blog, inspirada no tema iNove.</li></ul>
      <h2>Fontes</h2>
      <p>Vinte e dois textos vieram de um RSS completo capturado pela <a href="https://web.archive.org/" rel="external noopener">Wayback Machine</a>. Uma captura da página inicial de julho de 2008 forneceu outros sete textos integrais; a página inicial de setembro preservou parte de um oitavo. As páginas individuais forneceram os comentários. Cinco textos posteriores foram recuperados diretamente dos registros ARC do <a href="https://commoncrawl.org/" rel="external noopener">Common Crawl</a>. Imagens ainda disponíveis vieram do acervo original no WordPress.com.</p>
      <h2>Antes de skhaz.com</h2>
      <p>Uma captura de 9 de abril de 2008 do antecessor <code>skhaz.wordpress.com</code> preservou o aviso <a href="${migrationRoute}">“Mudando de casa”</a>, publicado no dia anterior e anunciando <code>www.skhaz.com</code>. Ele é exibido em uma seção própria porque nunca foi comprovado sob a rota <code>/blog/</code>. A versão pública desse aviso foi alterada em 2012 para apontar para NULL on error; essa revisão posterior é documentada como proveniência, mas não foi misturada ao corpus histórico de skhaz.com.</p>
      <h2>Limites honestos</h2>
      <p>Onze imagens, três downloads, dez corpos de comentários e o fim de um post parcial não apareceram em nenhum dos arquivos consultados. Eles não foram inventados: cada ausência é marcada no ponto exato ou junto ao conteúdo afetado. Scripts, formulários, publicidade, rastreadores e uma injeção maliciosa encontrada em uma cópia de 2010 foram descartados.</p>
      <h2>Princípio</h2>
      <blockquote>Restaurar o que existe, sinalizar o que falta e nunca preencher lacunas com conteúdo fabricado.</blockquote>
      <p>O inventário técnico e a proveniência de cada post ficam preservados junto ao código-fonte desta restauração.</p>
    </article>`,
	}),
);

await writeRoute(
	"/blog/politica-de-privacidade/",
	layout({
		title: "Política de Privacidade",
		description:
			"Página histórica de privacidade do skhaz.com, recuperada da captura de 2008.",
		route: "/blog/politica-de-privacidade/",
		bodyClass: "historical-page",
		content: `
    <header class="page-heading"><p class="eyebrow">Página histórica · 2008</p><h1>Política de Privacidade</h1></header>
    <article class="prose">
      <p>Este site pode utilizar cookies e/ou web beacons quando um usuário tem acesso às páginas. Os cookies que podem ser utilizados associam-se (se for o caso) unicamente com o navegador de um determinado computador.</p>
      <p>Os cookies que são utilizados neste site podem ser instalados pelo mesmo, os quais são originados dos distintos servidores operados por este, ou a partir dos servidores de terceiros que prestam serviços e instalam cookies e/ou web beacons (por exemplo, os cookies que são empregados para prover serviços de publicidade ou certos conteúdos através dos quais o usuário visualiza a publicidade ou conteúdos em tempo pré determinados). O usuário poderá pesquisar o disco rígido de seu computador conforme instruções do próprio navegador.</p>
      <p>Usuário tem a possibilidade de configurar seu navegador para ser avisado, na tela do computador, sobre a recepção dos cookies e para impedir a sua instalação no disco rígido. As informações pertinentes a esta configuração estão disponíveis em instruções e manuais do próprio navegador.</p>
      <aside class="media-note"><strong>Contexto:</strong> esta é a política publicada no WordPress original. O espelho estático atual não instala cookies, publicidade ou rastreadores.</aside>
      <details class="source-details"><summary>Fonte arquivística</summary><p>Wayback Machine, captura 20080528081831.</p><a href="https://web.archive.org/web/20080528081831/http://www.skhaz.com/blog/politica-de-privacidade/" rel="external nofollow noopener">Abrir registro original ↗</a></details>
    </article>`,
	}),
);

const cdata = (value) => value.replaceAll("]]>", "]]]]><![CDATA[>");
const commentFeed = (post) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>Comentários sobre ${escapeHtml(post.title)} — skhaz's blog</title>
  <link>${SITE_URL}/blog/${post.slug}/</link>
  <description>${post.comments.length} comentários recuperados de ${historicalCommentCount(post)} registrados</description>
  <language>pt-BR</language>
  ${post.comments
		.map(
			(comment, index) => `<item>
    <title>Comentário de ${escapeHtml(comment.author || "Anônimo")}</title>
    <link>${SITE_URL}/blog/${post.slug}/#${escapeHtml(comment.id || `comment-${index + 1}`)}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}/#${escapeHtml(comment.id || `comment-${index + 1}`)}</guid>
    <description><![CDATA[${cdata(prefixSitePaths(comment.html))}]]></description>
  </item>`,
		)
		.join("\n  ")}
</channel>
</rss>\n`;

const recoveredComments = posts.flatMap((post) =>
	post.comments.map((comment, index) => ({ post, comment, index })),
);
const commentsRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>Comentários — skhaz's blog</title>
  <link>${SITE_URL}/blog/</link>
  <description>${totalRecoveredComments} comentários históricos recuperados</description>
  <language>pt-BR</language>
  ${recoveredComments
		.map(
			({ post, comment, index }) => `<item>
    <title>Comentário de ${escapeHtml(comment.author || "Anônimo")} em ${escapeHtml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}/#${escapeHtml(comment.id || `comment-${index + 1}`)}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}/#${escapeHtml(comment.id || `comment-${index + 1}`)}</guid>
    <description><![CDATA[${cdata(prefixSitePaths(comment.html))}]]></description>
  </item>`,
		)
		.join("\n  ")}
</channel>
</rss>\n`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>skhaz's blog</title>
  <link>${SITE_URL}/blog/</link>
  <description>Code::Blog — arquivo restaurado</description>
  <language>pt-BR</language>
  <lastBuildDate>${new Date(posts[0].time).toUTCString()}</lastBuildDate>
  ${posts
		.map(
			(post) => `<item>
    <title>${escapeHtml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}/</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}/</guid>
    ${post.time ? `<pubDate>${new Date(post.time).toUTCString()}</pubDate>` : ""}
    <description><![CDATA[${cdata(post.excerpt)}]]></description>
    <content:encoded><![CDATA[${cdata(prefixSitePaths(post.html))}]]></content:encoded>
  </item>`,
		)
		.join("\n  ")}
</channel>
</rss>\n`;
await mkdir(path.join(DIST, "blog/feed"), { recursive: true });
await writeFile(path.join(DIST, "blog/feed/index.html"), rss);
await writeFile(path.join(DIST, "blog/feed.xml"), rss);
await writeFile(path.join(DIST, "feed.xml"), rss);
for (const alias of ["blog/feed/rss", "blog/feed/atom", "feed", "rss"]) {
	const directory = path.join(DIST, alias);
	await mkdir(directory, { recursive: true });
	await writeFile(path.join(directory, "index.html"), rss);
}
for (const post of posts) {
	const directory = path.join(DIST, "blog", post.slug, "feed");
	await mkdir(directory, { recursive: true });
	await writeFile(path.join(directory, "index.html"), commentFeed(post));
}
const commentsFeedDirectory = path.join(DIST, "blog", "comments", "feed");
await mkdir(commentsFeedDirectory, { recursive: true });
await writeFile(path.join(commentsFeedDirectory, "index.html"), commentsRss);
await writeFile(path.join(DIST, "blog", "comments.xml"), commentsRss);

const routes = [
	"/blog/",
	"/blog/lista-de-posts/",
	"/blog/sobre/",
	"/blog/politica-de-privacidade/",
	migrationRoute,
	...posts.map((post) => `/blog/${post.slug}/`),
	...categories.map(([category]) => `/blog/category/${slugify(category)}/`),
	...tags.map(([tag]) => `/blog/tag/${slugify(tag)}/`),
	...legacyTagAliases.map((alias) => alias.route),
	...months.map(([month]) => `/blog/${month.replace("-", "/")}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${escapeHtml(absoluteUrl(route))}</loc></url>`).join("\n")}
</urlset>\n`;
await writeFile(path.join(DIST, "sitemap.xml"), sitemap);
await writeFile(path.join(DIST, "blog", "sitemap.xml"), sitemap);
await writeFile(
	path.join(DIST, "robots.txt"),
	`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

await cp(routeToFile("/blog/"), routeToFile("/"));

await writeRoute(
	"/404/",
	layout({
		title: "Página não encontrada",
		description: "A página solicitada não foi encontrada no arquivo.",
		route: "/404/",
		noIndex: true,
		content: `<section class="not-found"><p class="error-code">404</p><h1>Esta página não entrou no arquivo.</h1><p>Talvez o post esteja no índice completo.</p><a class="button" href="/blog/lista-de-posts/">Ver todos os posts</a></section>`,
	}),
);
await cp(routeToFile("/404/"), path.join(DIST, "404.html"));

await writeFile(path.join(DIST, ".nojekyll"), "");

process.stdout.write(
	`Built ${posts.length} posts, ${getHighlightedCodeBlockCount()} highlighted code blocks, ${categories.length} categories, ${tags.length} tags and ${months.length} monthly archives.\n`,
);
