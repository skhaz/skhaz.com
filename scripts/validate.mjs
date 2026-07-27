import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BASE_PATH = "/skhaz.com";
const MIGRATION_ROUTE =
	"/arquivo/skhaz-wordpress-com/2008/04/08/mudando-de-casa/";
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

let imageshackProfile;
let predecessorPosts;
let currentMigrationPost;
let currentMigrationReplies;
let historicalMigrationSource;
let historicalFeedSource;
let recoveryAttempts;
try {
	imageshackProfile = JSON.parse(
		readFileSync(
			path.join(ROOT, "archive/sources/imageshack-profile-2026-07-26.json"),
			"utf8",
		),
	);
	predecessorPosts = JSON.parse(
		readFileSync(path.join(ROOT, "content/predecessor-posts.json"), "utf8"),
	);
	currentMigrationPost = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/wordpress-mudando-de-casa-2026-07-26.json",
			),
			"utf8",
		),
	);
	currentMigrationReplies = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/wordpress-mudando-de-casa-replies-2026-07-26.json",
			),
			"utf8",
		),
	);
	historicalMigrationSource = readFileSync(
		path.join(
			ROOT,
			"archive/sources/wayback-wordpress-com-home-2008-04.html",
		),
		"utf8",
	);
	historicalFeedSource = readFileSync(
		path.join(ROOT, "archive/sources/wayback-feed-2008.xml"),
		"utf8",
	);
	recoveryAttempts = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/recovery-attempts-2026-07-27.json",
			),
			"utf8",
		),
	);
} catch (error) {
	console.error(
		`Unable to parse a preserved source snapshot: ${error instanceof Error ? error.message : String(error)}`,
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
const imageshackImages = imageshackProfile?.result?.images ?? [];
check(
	imageshackProfile?.result?.total === 49 && imageshackImages.length === 49,
	"expected 49 entries in the preserved ImageShack profile snapshot",
);
const expectedImageshackTargets = new Map([
	["msvczm8.png", ["2jmsvczm8p", 1024, 768]],
	["msvc9mb0.png", ["bamsvc9mb0p", 756, 581]],
	["2242002764ab16f49f4dofs2.png", ["b92242002764ab16f49f4dofs2p", 1024, 768]],
	["finalor9.png", ["79finalor9p", 1145, 808]],
	["mapakm5.png", ["6omapakm5p", 1024, 768]],
	["mapatermicoyb6xb3.png", ["6omapatermicoyb6xb3p", 800, 600]],
]);
for (const [filename, [id, width, height]] of expectedImageshackTargets) {
	const image = imageshackImages.find((entry) => entry.filename === filename);
	check(
		image?.id === id &&
			image?.owner?.username === "skhaz" &&
			image?.width === width &&
			image?.height === height,
		`missing or inconsistent ImageShack metadata for ${filename}`,
	);
}
const imageRecoveryAttempts = recoveryAttempts?.imageShack?.attempts ?? [];
check(
	imageRecoveryAttempts.length === 30 &&
		recoveryAttempts?.imageShack?.validImageResponses === 0 &&
		imageRecoveryAttempts.every((attempt) => !attempt.binarySignature),
	"the recovery manifest must retain 30 unsuccessful ImageShack binary checks",
);
for (const filename of expectedImageshackTargets.keys()) {
	const attempts = imageRecoveryAttempts.filter(
		(attempt) => attempt.asset === filename,
	);
	const route = (name) => attempts.find((attempt) => attempt.route === name);
	check(
		["legacy-original", "legacy-thumbnail", "imagizer-original"].every(
			(name) =>
				route(name)?.httpStatus === 404 &&
				route(name)?.contentType === "text/html" &&
				route(name)?.contentLength === 168,
		) &&
			route("image-page-download")?.httpStatus === 200 &&
			route("image-page-download")?.contentType === "text/html" &&
			route("download-route")?.httpStatus === 200 &&
			route("download-route")?.contentType === "application/octet-stream" &&
			route("download-route")?.contentLength === 0,
		`inconsistent negative recovery evidence for ${filename}`,
	);
}
const boostRecoveryAttempts = recoveryAttempts?.boost?.attempts ?? [];
const expectedEmptyBoostCdxTargets = [
	"www.skhaz.com/blog/wp-content/uploads/2008/06/boostconfig1.png",
	"www.skhaz.com/blog/wp-content/uploads/2008/06/boostinstaller2.png",
	"www.skhaz.com/blog/wp-content/uploads/2008/06/boostconfig1-300x234.png",
	"www.skhaz.com/blog/wp-content/uploads/2008/06/boostinstaller2-300x234.png",
	"boost-consulting.com/boost_1_35_0_setup.exe",
];
check(
	recoveryAttempts?.boost?.validImageResponses === 0 &&
		expectedEmptyBoostCdxTargets.every((target) =>
			boostRecoveryAttempts.some(
				(attempt) =>
					attempt.target === target &&
					attempt.archive === "Wayback CDX" &&
					attempt.httpStatus === 200 &&
					attempt.semantic?.empty === true,
			),
		) &&
		recoveryAttempts?.archiveTeamSearch?.semantic?.numFound === 0,
	"the recovery manifest must retain successful negative Boost and ArchiveTeam queries",
);
check(
	posts.every((post) => {
		const source = post.source;
		if (
			!source?.archive ||
			!source?.originalUrl ||
			!/^\d{14}$/.test(source?.capturedAt ?? "") ||
			!source?.captureUrl ||
			source.captureUrl.includes("/web/*/")
		) {
			return false;
		}
		if (source.archive === "Common Crawl") {
			const record = source.record;
			return (
				record?.filename &&
				record?.offset &&
				record?.length &&
				record?.digest &&
				source.captureUrl.includes(record.filename) &&
				source.captureUrl.includes(`offset=${record.offset}`) &&
				source.captureUrl.includes(`length=${record.length}`)
			);
		}
		return source.captureUrl.includes(source.capturedAt);
	}),
	"every post must include capture-bound archive provenance",
);
const classStringPost = posts.find(
	(post) =>
		post.slug ===
		"classe-stdstring-stl-no-vc-6-provoca-corrupcao-da-memoria",
);
const expectedClassStringHtml =
	'<p>Hoje em dia se torna mais comum computadores com mais de um núcleo, esse bug afeta apenas o Microsoft Visual C++ 6.0, e pode ser um problema para quem usa ele.</p>\n<p>Referencia <a href="http://support.microsoft.com/kb/813810/pt" rel="external noopener" target="_blank">Classe std::string STL provoca falhas e uma corrupção da memória em computadores com múltiplos processadores</a></p>';
check(
	classStringPost?.html === expectedClassStringHtml &&
		classStringPost?.source?.capturedAt === "20080528143819" &&
		classStringPost?.source?.record?.digest ===
			"OWPCEDQ3W3R5IIHOO7OY32IN2Z5Z462F" &&
		classStringPost?.source?.record?.guid ===
			"http://skhaz.wordpress.com/?p=27" &&
		classStringPost?.source?.record?.localArtifact ===
			"archive/sources/wayback-feed-2008.xml",
	"the std::string post must retain its specific FeedBurner capture provenance",
);
check(
	historicalFeedSource.includes(
		"<link>http://www.skhaz.com/blog/classe-stdstring-stl-no-vc-6-provoca-corrupcao-da-memoria/</link>",
	) &&
		historicalFeedSource.includes(
			"Hoje em dia se torna mais comum computadores com mais de um núcleo",
		),
	"the preserved FeedBurner snapshot must contain the std::string post",
);
const migrationPost = predecessorPosts?.find(
	(post) => post.id === "wordpress-com-59",
);
const expectedMigrationHtml =
	'<p>Estou mudando de domínio, o novo endereço será <a href="http://www.skhaz.com/" rel="external nofollow noopener">http://www.skhaz.com/</a>, obrigado à todos que me apoiarão publicando meu blog no blogtroll (não deixem de atualizar para o novo endereço :D)</p>';
check(
	Array.isArray(predecessorPosts) && predecessorPosts.length === 1,
	"expected one separately preserved predecessor-site record",
);
check(
	migrationPost?.source?.capturedAt === "20080409155551" &&
		migrationPost?.source?.record?.digest ===
			"AR4KQOANEEYJ5JNWCUCKYVCSXLYEJ7K6" &&
		migrationPost?.knownCommentCount === 0 &&
		migrationPost?.html === expectedMigrationHtml &&
		!migrationPost?.html.includes("nullonerror"),
	"the predecessor record must use the contemporaneous 2008 migration body",
);
check(
	historicalMigrationSource.includes(
		"Estou mudando de domínio, o novo endereço será <a href=\"http://www.skhaz.com/\"",
	) && historicalMigrationSource.includes("Mudando de&nbsp;casa"),
	"the preserved 2008 WordPress.com homepage must contain the migration notice",
);
check(
	currentMigrationPost?.ID === 59 &&
		currentMigrationPost?.modified === "2012-02-23T22:26:25+00:00" &&
		currentMigrationPost?.content?.includes("nullonerror.appspot.com") &&
		currentMigrationReplies?.found === 0 &&
		currentMigrationReplies?.comments?.length === 0,
	"the later WordPress.com revision and zero-comment evidence must remain preserved",
);
const unsafeActiveHtml =
	/<script\b|<form\b|<object\b|<embed\b|\son[a-z]+\s*=|(?:javascript|vbscript|data):/i;
check(
	posts.every((post) => !unsafeActiveHtml.test(post.html)),
	"restored post HTML must not include active or injected content",
);
check(
	migrationPost?.html && !unsafeActiveHtml.test(migrationPost.html),
	"the predecessor record must not include active or injected content",
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

const migrationFile = path.join(
	DIST,
	MIGRATION_ROUTE.replace(/^\//, "").replace(/\/$/, ""),
	"index.html",
);
check(existsSync(migrationFile), "missing generated predecessor migration page");
if (existsSync(migrationFile)) {
	const migrationHtml = readFileSync(migrationFile, "utf8");
	check(
		migrationHtml.includes("Estou mudando de domínio") &&
			migrationHtml.includes("Fase WordPress.com") &&
			migrationHtml.includes("20080409155551"),
		"the generated predecessor page must expose its historical body and provenance",
	);
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
	`Validated ${posts.length} posts, ${predecessorPosts.length} predecessor record, 72 complete comments (82 recorded), ${htmlFiles.length} HTML pages and all local references.\n`,
);
