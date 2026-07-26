import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BASE_PATH = "/skhaz.com";
const problems = [];
const check = (condition, message) => {
	if (!condition) problems.push(message);
};

try {
	execFileSync(process.execPath, [path.join(ROOT, "scripts/build.mjs")], {
		cwd: ROOT,
		stdio: "inherit",
	});
} catch (error) {
	console.error("Build failed before validation.");
	process.exit(error.status ?? 1);
}

let posts;
try {
	posts = JSON.parse(
		readFileSync(path.join(ROOT, "content/posts.json"), "utf8"),
	);
} catch (error) {
	console.error(
		`Unable to parse content/posts.json: ${error instanceof Error ? error.message : String(error)}`,
	);
	process.exit(1);
}

check(Array.isArray(posts), "posts.json must contain an array");
check(posts.length === 35, `expected 35 restored posts, found ${posts.length}`);
check(
	new Set(posts.map((post) => post.slug)).size === posts.length,
	"post slugs must be unique",
);
check(
	posts.reduce((sum, post) => sum + post.comments.length, 0) === 72,
	"expected 72 fully restored comments",
);
check(
	posts.reduce(
		(sum, post) => sum + (post.knownCommentCount ?? post.comments.length),
		0,
	) === 82,
	"expected 82 comments recorded across historical captures",
);
check(
	posts.reduce((sum, post) => sum + post.missingMedia.length, 0) === 11,
	"expected 11 explicitly documented missing images",
);
check(
	posts.reduce((sum, post) => sum + post.missingDownloads.length, 0) === 3,
	"expected 3 explicitly documented missing downloads",
);
check(
	posts.every((post) => post.source?.archive && post.source?.captureUrl),
	"every post must include archive provenance",
);
const unsafeActiveHtml =
	/<script\b|<form\b|<object\b|<embed\b|\son[a-z]+\s*=|(?:javascript|vbscript|data):/i;
check(
	posts.every((post) => !unsafeActiveHtml.test(post.html)),
	"restored post HTML must not include active or injected content",
);
check(
	posts.every(
		(post) =>
			!post.comments.some(
				(comment) =>
					unsafeActiveHtml.test(comment.html) || /<iframe\b/i.test(comment.html),
			),
	),
	"restored comment HTML must not include active or injected content",
);
check(
	posts.every((post) =>
		[...post.html.matchAll(/<iframe\b[^>]*>/gi)].every((match) =>
			/src="https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]+"/i.test(
				match[0],
			),
		),
	),
	"restored post iframes must use youtube-nocookie.com",
);
check(
	posts.every((post) => post.html || post.slug === "bem-vindos"),
	"only the historically empty Bem vindos post may have no body",
);

for (const post of posts) {
	const file = path.join(DIST, "blog", post.slug, "index.html");
	const feedFile = path.join(DIST, "blog", post.slug, "feed", "index.html");
	check(existsSync(file), `missing generated post: ${post.slug}`);
	check(existsSync(feedFile), `missing historical comment feed: ${post.slug}`);
	if (existsSync(file)) {
		const html = readFileSync(file, "utf8");
		check(
			html.includes(post.title),
			`generated page does not contain title: ${post.slug}`,
		);
		check(
			html.includes("Fonte arquivística"),
			`generated page does not expose provenance: ${post.slug}`,
		);
	}
}

const htmlFiles = [];
const walk = (directory) => {
	for (const name of readdirSync(directory)) {
		const file = path.join(directory, name);
		if (statSync(file).isDirectory()) walk(file);
		else if (name.endsWith(".html")) htmlFiles.push(file);
	}
};
walk(DIST);

const resolveLocalReference = (reference) => {
	const pathname = reference.split("#")[0].split("?")[0];
	if (
		!pathname ||
		pathname.startsWith("#") ||
		/^[a-z][a-z0-9+.-]*:/i.test(pathname) ||
		pathname.startsWith("//")
	)
		return null;
	const sitePath = pathname.startsWith(`${BASE_PATH}/`)
		? pathname.slice(BASE_PATH.length)
		: pathname;
	const relative = sitePath.startsWith("/") ? sitePath.slice(1) : sitePath;
	const target = path.join(DIST, relative);
	if (pathname.endsWith("/")) return path.join(target, "index.html");
	return path.extname(target) ? target : path.join(target, "index.html");
};

for (const file of htmlFiles) {
	const html = readFileSync(file, "utf8");
	check(
		!/<script(?![^>]*src="\/skhaz\.com\/assets\/app\.js")/i.test(html),
		`unexpected inline or third-party script in ${path.relative(DIST, file)}`,
	);
	check(
		!/\b(?:href|src)="http:\/\/(?:www\.)?skhaz\.com\/blog\/wp-(?:content|includes)/i.test(
			html,
		),
		`broken legacy asset request in ${path.relative(DIST, file)}`,
	);

	for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
		const target = resolveLocalReference(match[1]);
		if (target)
			check(
				existsSync(target),
				`broken local reference ${match[1]} in ${path.relative(DIST, file)}`,
			);
	}
}

check(
	existsSync(path.join(DIST, "blog", "politica-de-privacidade", "index.html")),
	"missing restored privacy page",
);
check(
	existsSync(path.join(DIST, "blog", "tag", "c", "index.html")),
	"missing historical /blog/tag/c/ route",
);
for (const tag of [
	"const_cast",
	"shared_ptr",
	"humor",
	"deque",
	"mem_fn",
	"mem_fun",
	"thread",
]) {
	check(
		existsSync(path.join(DIST, "blog", "tag", tag, "index.html")),
		`missing historical /blog/tag/${tag}/ route`,
	);
}
check(
	existsSync(path.join(DIST, "blog", "feed", "rss", "index.html")),
	"missing historical RSS alias",
);
check(
	existsSync(path.join(DIST, "blog", "sitemap.xml")),
	"missing historical /blog/sitemap.xml route",
);
check(
	existsSync(path.join(DIST, "blog", "feed", "index.html")),
	"missing RSS endpoint",
);
check(
	existsSync(path.join(DIST, "blog", "comments", "feed", "index.html")),
	"missing historical global comments feed",
);
check(
	readFileSync(
		path.join(DIST, "blog", "feed", "index.html"),
		"utf8",
	).startsWith("<?xml"),
	"RSS endpoint must contain XML",
);
check(existsSync(path.join(DIST, "sitemap.xml")), "missing sitemap.xml");
const stylesheet = readFileSync(path.join(DIST, "assets", "style.css"), "utf8");
for (const match of stylesheet.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
	const reference = match[1];
	if (/^(?:data:|https?:|\/\/)/i.test(reference)) continue;
	const target = reference.startsWith("/")
		? path.join(DIST, reference.replace(/^\/+/, ""))
		: path.join(DIST, "assets", reference);
	check(existsSync(target), `broken stylesheet asset ${reference}`);
}
check(
	htmlFiles.length > posts.length,
	"expected index, taxonomy, archive and utility pages in addition to posts",
);

if (problems.length > 0) {
	process.stderr.write(
		`\nValidation failed with ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n`,
	);
	for (const problem of problems) process.stderr.write(`- ${problem}\n`);
	process.exit(1);
}

process.stdout.write(
	`Validated ${posts.length} posts, 72 complete comments (82 recorded), ${htmlFiles.length} HTML pages and all local references.\n`,
);
