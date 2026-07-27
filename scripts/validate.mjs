import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	decodeCodeEntitiesOnce,
	normalizeCppCode,
} from "./code-presentation.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BASE_PATH = "/skhaz.com";
const MIGRATION_ROUTE =
	"/arquivo/skhaz-wordpress-com/2008/04/08/mudando-de-casa/";
const problems = [];
const check = (condition, message) => {
	if (!condition) problems.push(message);
};
const hasExactValues = (actual, expected) => {
	const actualSet = new Set(actual);
	const expectedSet = new Set(expected);
	return (
		actual.length === actualSet.size &&
		actualSet.size === expectedSet.size &&
		[...expectedSet].every((value) => actualSet.has(value))
	);
};
const isSha256 = (value) => /^[0-9a-f]{64}$/.test(value ?? "");
const decodeBase32Hex = (value) => {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	if (!/^[A-Z2-7]{32}$/.test(value)) return null;
	let bits = "";
	for (const character of value) {
		const index = alphabet.indexOf(character);
		bits += index.toString(2).padStart(5, "0");
	}
	if (bits.length !== 160) return null;
	const bytes = [];
	for (let index = 0; index < bits.length; index += 8) {
		bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
	}
	return bytes.length === 20 ? Buffer.from(bytes).toString("hex") : null;
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
let historicalSeptemberHomeSource;
let recoveryAttempts;
let deepMediaSweep;
let missingMediaContinuation;
let missingMediaContinuationSource;
let commonCrawlEarlySweep;
let commonCrawlRemainingSweep;
let commonCrawlCollectionsSource;
let boostInstallerEvidence;
let highlightingPerformance;
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
		path.join(ROOT, "archive/sources/wayback-wordpress-com-home-2008-04.html"),
		"utf8",
	);
	historicalFeedSource = readFileSync(
		path.join(ROOT, "archive/sources/wayback-feed-2008.xml"),
		"utf8",
	);
	historicalSeptemberHomeSource = readFileSync(
		path.join(ROOT, "archive/sources/wayback-home-2008-09.html"),
	);
	recoveryAttempts = JSON.parse(
		readFileSync(
			path.join(ROOT, "archive/sources/recovery-attempts-2026-07-27.json"),
			"utf8",
		),
	);
	deepMediaSweep = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/missing-media-deep-sweep-2026-07-27.json",
			),
			"utf8",
		),
	);
	missingMediaContinuationSource = readFileSync(
		path.join(
			ROOT,
			"archive/sources/missing-media-continuation-2026-07-27.json",
		),
	);
	missingMediaContinuation = JSON.parse(
		missingMediaContinuationSource.toString("utf8"),
	);
	commonCrawlEarlySweep = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/commoncrawl-missing-assets-raw-index-2026-07-27.json",
			),
			"utf8",
		),
	);
	commonCrawlRemainingSweep = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/commoncrawl-missing-assets-remaining-indexes-2026-07-27.json",
			),
			"utf8",
		),
	);
	commonCrawlCollectionsSource = readFileSync(
		path.join(ROOT, "archive/sources/commoncrawl-collections-2026-07-27.html"),
	);
	boostInstallerEvidence = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/boostpro-1.35-installer-2026-07-27.json",
			),
			"utf8",
		),
	);
	highlightingPerformance = JSON.parse(
		readFileSync(
			path.join(
				ROOT,
				"archive/sources/highlighting-performance-2026-07-27.json",
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

check(
	missingMediaContinuationSource.length === 46574 &&
		createHash("sha256")
			.update(missingMediaContinuationSource)
			.digest("hex") ===
			"81f2ae7ae2b5bc589381aff0cd4630798d62c4800e5434342739ffcd156f3567",
	"the synthesized continuation evidence must remain byte-for-byte unchanged",
);
check(
	historicalSeptemberHomeSource.length === 11172 &&
		createHash("sha256").update(historicalSeptemberHomeSource).digest("hex") ===
			"31165f3957508e4fa958de7ca86646d3e5acaca8e7664fc996f6e5a5eede623e",
	"the raw September 2008 Wayback source must remain byte-for-byte unchanged",
);
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
const countCppBlocks = (html) =>
	[...html.matchAll(/<pre\b([^>]*)>[\s\S]*?<\/pre>/gi)].filter((match) =>
		/(?:syntax-highlight:cpp|class="cpp")/i.test(match[1]),
	).length;
const expectedCppBlockCount = posts.reduce(
	(sum, post) => sum + countCppBlocks(post.html),
	0,
);
check(
	expectedCppBlockCount === 38,
	`expected 38 historical C++ blocks, found ${expectedCppBlockCount}`,
);
check(
	decodeCodeEntitiesOnce("&#x110000; &#55296;") === "&#x110000; &#55296;" &&
		normalizeCppCode('const char* entity = "&amp;amp;";') ===
			'const char* entity = "&amp;";' &&
		normalizeCppCode('const char* entity = "&amp;amp;";', {
			decodeTwice: true,
		}) === 'const char* entity = "&";',
	"C++ entity decoding must be bounded, scalar-safe and explicitly attested",
);
check(
	normalizeCppCode(
		'class Fixture\n{\npublic:\nvoid run()\n{\nconst char* brace = "}";\n/* { */\nwork();\n}\n};',
	).includes(
		'public:\n    void run()\n    {\n        const char* brace = "}";\n        /* { */\n        work();',
	),
	"C++ indentation must ignore braces inside strings and comments",
);
check(
	normalizeCppCode(
		"for (int index = 0; index < count; index++)\nprocess(index);",
	) === "for (int index = 0; index < count; index++)\n    process(index);" &&
		normalizeCppCode("if (ready)\n{\nprocess();\n}") ===
			"if (ready)\n{\n    process();\n}",
	"C++ indentation must distinguish unbraced bodies from next-line braces",
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
const deepImageShackAttempts =
	deepMediaSweep?.imageShackDeepRoutes?.attempts ?? [];
const deepWordPressAttempts =
	deepMediaSweep?.wordpressCdnRoutes?.attempts ?? [];
const protectedWordPressMedia =
	deepMediaSweep?.wordpressMediaApi?.attempts ?? [];
const expectedDeepImageShackRoutes = [
	"app-download",
	"app-download-com",
	"app-archive-link",
	"v2-thumb",
	"v2-1024x768",
	"v2-quality-only",
	"scaled-thumb60x60",
	"scaled-square70",
	"api-image-detail",
];
const expectedWordPressAssets = [
	"unixsextafeira13.jpg",
	"unixsextafeira13-300x240.jpg",
	"boostconfig1.png",
	"boostconfig1-300x234.png",
	"boostinstaller2.png",
	"boostinstaller2-300x234.png",
	"desktop.jpg",
	"msvczm8.png",
	"msvczm8-300x225.png",
];
const expectedWordPressRoutes = [
	"direct:skhaz.files.wordpress.com",
	"i0.wp.com:skhaz.files.wordpress.com",
	"i1.wp.com:skhaz.files.wordpress.com",
	"i2.wp.com:skhaz.files.wordpress.com",
	"direct:skhaz.wordpress.com",
	"i0.wp.com:skhaz.wordpress.com",
	"i1.wp.com:skhaz.wordpress.com",
	"i2.wp.com:skhaz.wordpress.com",
];
const isCoherentNegativeAttempt = (attempt) =>
	attempt?.binarySignature == null &&
	!/^image\//i.test(attempt?.contentType ?? "") &&
	Number.isInteger(attempt?.httpStatus) &&
	Number.isInteger(attempt?.contentLength) &&
	attempt.contentLength >= 0 &&
	isSha256(attempt?.sha256) &&
	/^https:\/\//.test(attempt?.url ?? "");
const hasExactAttemptMatrix = (attempts, assets, routes) =>
	hasExactValues(
		attempts.map((attempt) => `${attempt.asset}\0${attempt.route}`),
		assets.flatMap((asset) => routes.map((route) => `${asset}\0${route}`)),
	) && attempts.every(isCoherentNegativeAttempt);
const openverseQueries = deepMediaSweep?.openverse?.queries ?? [];
const expectedOpenverseLabels = [
	"openverse:unixsextafeira13",
	"openverse:boostconfig1",
	"openverse:boostinstaller2",
	"openverse:desktop skhaz",
	"openverse:msvczm8",
	"openverse:msvc9mb0",
	"openverse:2242002764ab16f49f4dofs2",
	"openverse:finalor9",
	"openverse:mapakm5",
	"openverse:mapatermicoyb6xb3",
];
const expectedImageShackAttemptUrl = (attempt) => {
	const image = imageshackImages.find(
		(entry) => entry.filename === attempt.asset,
	);
	if (!image) return null;
	const routeTemplates = {
		"app-download": `https://imageshack.us/download/${image.server}/${image.filename}`,
		"app-download-com": `https://imageshack.com/download/${image.server}/${image.filename}`,
		"app-archive-link": `https://imageshack.com/a/img${image.server}/${image.bucket}/${image.filename}`,
		"v2-thumb": `https://imagizer.imageshack.com/v2/240x180q70/${image.server}/${image.filename}`,
		"v2-1024x768": `https://imagizer.imageshack.com/v2/1024x768q100/${image.server}/${image.filename}`,
		"v2-quality-only": `https://imagizer.imageshack.com/v2/q100/${image.server}/${image.filename}`,
		"scaled-thumb60x60": `https://imageshack.com/scaled/thumb60x60/${image.server}/${image.filename}`,
		"scaled-square70": `https://imageshack.com/scaled/square70/${image.server}/${image.filename}`,
		"api-image-detail": `https://imageshack.com/rest_api/v2/images/${image.id}`,
	};
	return routeTemplates[attempt.route] ?? null;
};
const wordpressAssetDatePath = (asset) => {
	if (asset.startsWith("unixsextafeira13")) return "2009/02";
	if (asset.startsWith("boost")) return "2008/06";
	return "2008/05";
};
const expectedWordPressAttemptUrl = (attempt) => {
	const [hostLabel, origin] = attempt.route.split(":");
	const datePath = wordpressAssetDatePath(attempt.asset);
	const originPath =
		origin === "skhaz.files.wordpress.com"
			? `${origin}/${datePath}/${attempt.asset}`
			: `${origin}/wp-content/uploads/${datePath}/${attempt.asset}`;
	return hostLabel === "direct"
		? `https://${originPath}`
		: `https://${hostLabel}/${originPath}`;
};
check(
	deepMediaSweep?.schemaVersion === 1 &&
		deepMediaSweep?.imageShackDeepRoutes?.count ===
			deepImageShackAttempts.length &&
		deepMediaSweep?.imageShackDeepRoutes?.validImageResponses === 0 &&
		hasExactAttemptMatrix(
			deepImageShackAttempts,
			[...expectedImageshackTargets.keys()],
			expectedDeepImageShackRoutes,
		) &&
		deepImageShackAttempts.every(
			(attempt) =>
				attempt.url === expectedImageShackAttemptUrl(attempt) &&
				(attempt.route === "api-image-detail"
					? attempt.httpStatus === 200 &&
						attempt.contentType === "application/json; charset=utf-8"
					: attempt.httpStatus === 404 && attempt.contentType === "text/html"),
		) &&
		deepMediaSweep?.wordpressCdnRoutes?.count ===
			deepWordPressAttempts.length &&
		deepMediaSweep?.wordpressCdnRoutes?.validImageResponses === 0 &&
		hasExactAttemptMatrix(
			deepWordPressAttempts,
			expectedWordPressAssets,
			expectedWordPressRoutes,
		) &&
		deepWordPressAttempts.every(
			(attempt) =>
				attempt.httpStatus === 404 &&
				attempt.url === expectedWordPressAttemptUrl(attempt),
		) &&
		deepMediaSweep?.wordpressMediaApi?.authenticatedAccessRequired === true &&
		hasExactValues(
			protectedWordPressMedia.map((attempt) => attempt.mediaId),
			[107, 108, 118, 120],
		) &&
		protectedWordPressMedia.every(
			(attempt) =>
				attempt.httpStatus === 403 &&
				attempt.contentType === "application/json" &&
				attempt.url ===
					`https://public-api.wordpress.com/rest/v1.1/sites/2393109/media/${attempt.mediaId}` &&
				isCoherentNegativeAttempt(attempt),
		) &&
		deepMediaSweep?.openverse?.count === openverseQueries.length &&
		deepMediaSweep?.openverse?.totalResults === 0 &&
		hasExactValues(
			openverseQueries.map((query) => query.label),
			expectedOpenverseLabels,
		) &&
		openverseQueries.every((query) => {
			let url;
			try {
				url = new URL(query.url);
			} catch {
				return false;
			}
			return (
				query.httpStatus === 200 &&
				query.contentType === "application/json" &&
				url.origin === "https://api.openverse.org" &&
				url.pathname === "/v1/images/" &&
				url.searchParams.get("q") === query.label.slice("openverse:".length) &&
				url.searchParams.get("page_size") === "20" &&
				query.semantic?.resultCount === 0 &&
				query.semantic?.pageCount === 0 &&
				isCoherentNegativeAttempt(query)
			);
		}),
	"the deep-media manifest must retain the exact scoped negative checks",
);
const continuationArchiveTeam = missingMediaContinuation?.archiveTeamImageShack;
const archiveTeamStatusHistory =
	continuationArchiveTeam?.revisionApi?.statusHistory ?? [];
check(
	missingMediaContinuation?.schemaVersion === 1 &&
		continuationArchiveTeam?.wiki?.httpStatus === 200 &&
		continuationArchiveTeam?.wiki?.statesNotSavedYet === true &&
		isSha256(continuationArchiveTeam?.wiki?.sha256) &&
		continuationArchiveTeam?.revisionApi?.revisionCount ===
			archiveTeamStatusHistory.length &&
		archiveTeamStatusHistory.length === 17 &&
		hasExactValues(
			archiveTeamStatusHistory.map((revision) => revision.revid),
			[
				58963, 28795, 28258, 28026, 27945, 27708, 27686, 27155, 26976,
				24534, 24533, 23739, 20548, 17234, 7576, 2296, 2151,
			],
		) &&
		archiveTeamStatusHistory.every(
			(revision) => revision.archivingStatus === "{{notsavedyet}}",
		) &&
		continuationArchiveTeam?.tracker?.httpStatus === 404 &&
		continuationArchiveTeam?.githubRepositorySearch?.httpStatus === 200 &&
		continuationArchiveTeam?.githubRepositorySearch?.totalCount === 0,
	"the continuation must retain the bounded public ArchiveTeam ImageShack evidence",
);
const continuationIaSearches =
	missingMediaContinuation?.internetArchiveMetadataSearches ?? [];
const expectedContinuationIaResults = new Map([
	["six-image-tokens", [0, []]],
	["all-distinctive-target-names", [0, []]],
	["imageshack-data-items", [1, ["4archive"]]],
	["author-creator", [0, []]],
]);
check(
	hasExactValues(
		continuationIaSearches.map((query) => query.label),
		[...expectedContinuationIaResults.keys()],
	) &&
		continuationIaSearches.every((query) => {
			const expected = expectedContinuationIaResults.get(query.label);
			return (
				expected &&
				query.httpStatus === 200 &&
				query.numFound === expected[0] &&
				hasExactValues(query.identifiers ?? [], expected[1]) &&
				isSha256(query.sha256)
			);
		}),
	"the continuation must retain the exact Internet Archive metadata results",
);
const fourArchiveEvidence = missingMediaContinuation?.fourArchiveCandidate;
const fourArchiveFiles = fourArchiveEvidence?.archives ?? [];
const expectedFourArchiveFiles = new Map([
	[
		"4chan_imageshack_links.7z",
		[
			22515122,
			"8012efaf9a3c1de087b51b6e066b90e72a962489",
			"89b053a54753e60250f05ef44cd6af826ea4ba54b7339b95153e3e8bf0901ce6",
			1,
			89815187,
		],
	],
	[
		"4archive-imageurls.7z",
		[
			21617353,
			"91f79b212577d5fdcbe57ee46838e0358426fa6e",
			"49c49db76c813d982174589e1efe15b0495783c6bfc800ed0fcf521698bb99ae",
			57646,
			106523916,
		],
	],
]);
check(
	hasExactValues(
		fourArchiveFiles.map((archive) => archive.name),
		[...expectedFourArchiveFiles.keys()],
	) &&
		fourArchiveFiles.every((archive) => {
			const expected = expectedFourArchiveFiles.get(archive.name);
			return (
				expected &&
				archive.publishedByInternetArchive?.bytes === expected[0] &&
				archive.publishedByInternetArchive?.sha1 === expected[1] &&
				archive.download?.bytes ===
					archive.publishedByInternetArchive.bytes &&
				archive.download?.sha1 ===
					archive.publishedByInternetArchive.sha1 &&
				archive.download?.sha256 === expected[2] &&
				archive.extractedFiles === expected[3] &&
				archive.extractedBytes === expected[4] &&
				archive.search?.extractedFiles === archive.extractedFiles &&
				archive.search?.extractedBytes === archive.extractedBytes &&
				archive.search?.matches === 0
			);
		}) &&
		fourArchiveEvidence?.matches === 0 &&
		fourArchiveEvidence?.extractedFiles ===
			fourArchiveFiles.reduce(
				(sum, archive) => sum + archive.extractedFiles,
				0,
			) &&
		fourArchiveEvidence?.extractedBytes ===
			fourArchiveFiles.reduce(
				(sum, archive) => sum + archive.extractedBytes,
				0,
			) &&
		hasExactValues(fourArchiveEvidence?.patterns ?? [], [
			"msvczm8",
			"msvc9mb0",
			"2242002764ab16f49f4dofs2",
			"finalor9",
			"mapakm5",
			"mapatermicoyb6xb3",
			"2jmsvczm8p",
			"bamsvc9mb0p",
			"b92242002764ab16f49f4dofs2p",
			"79finalor9p",
			"6omapakm5p",
			"6omapatermicoyb6xb3p",
			"img91/9260",
			"img406/7664",
			"img405/1079",
			"img261/2865",
			"img240/2306",
			"img240/9194",
		]),
	"the 4archive candidate maps must retain their verified hashes and complete negative search",
);
const expectedMementoLocalTargets = [
	["unixsextafeira13", "2009/02/unixsextafeira13.jpg"],
	["boostconfig1", "2008/06/boostconfig1.png"],
	["boostinstaller2", "2008/06/boostinstaller2.png"],
	["desktop", "2008/05/desktop.jpg"],
	["msvczm8-wordpress", "2008/05/msvczm8.png"],
	["scheduler", "2008/06/scheduler.zip"],
	["physicsfs", "2008/04/physicsfs.zip"],
	["sdl-physicsfs", "2008/04/sdl-physicsfs.zip"],
];
const expectedMementoTargets = new Map(
	expectedMementoLocalTargets
		.flatMap(([label, targetPath]) => [
			[
				label,
				`http://www.skhaz.com/blog/wp-content/uploads/${targetPath}`,
			],
			[
				`${label}-no-www`,
				`http://skhaz.com/blog/wp-content/uploads/${targetPath}`,
			],
		])
		.concat([
			[
				"msvczm8-imageshack",
				"http://img91.imageshack.us/img91/9260/msvczm8.png",
			],
			[
				"msvc9mb0",
				"http://img406.imageshack.us/img406/7664/msvc9mb0.png",
			],
			[
				"2242002764ab16f49f4dofs2",
				"http://img405.imageshack.us/img405/1079/2242002764ab16f49f4dofs2.png",
			],
			[
				"finalor9",
				"http://img261.imageshack.us/img261/2865/finalor9.png",
			],
			[
				"mapakm5",
				"http://img240.imageshack.us/img240/2306/mapakm5.png",
			],
			[
				"mapatermicoyb6xb3",
				"http://img240.imageshack.us/img240/9194/mapatermicoyb6xb3.png",
			],
		]),
);
const mementoEvidence = missingMediaContinuation?.mementoAggregation;
const mementoResults = mementoEvidence?.results ?? [];
const mementoArchiveErrors = mementoResults.flatMap((result) =>
	result.stderrLines.map((line) => ({
		label: result.label,
		archive: line.match(/main\.go:\d+: ([^ ]+) =>/)?.[1] ?? null,
	})),
);
const emptySha256 =
	"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
check(
	mementoEvidence?.tool?.version === "1.0-rc9" &&
		mementoEvidence?.tool?.activeArchiveCount === 13 &&
		mementoEvidence?.tool?.archivesConfigSha256 ===
			"e78e9c65fd40d96971069623354a4289707aafb6a746b43da0b32c243cfa104c" &&
		hasExactValues(
			mementoResults.map((result) => result.label),
			[...expectedMementoTargets.keys()],
		) &&
		mementoResults.every(
			(result) =>
				result.originalUrl === expectedMementoTargets.get(result.label) &&
				result.exitCode === 0 &&
				result.stdoutBytes === 0 &&
				result.stdoutSha256 === emptySha256 &&
				Array.isArray(result.mementos) &&
				result.mementos.length === 0 &&
				Array.isArray(result.stderrLines) &&
				result.stderrLines.length > 0 &&
				result.stderrBytes ===
					Buffer.byteLength(`${result.stderrLines.join("\n")}\n`) &&
				result.stderrSha256 ===
					createHash("sha256")
						.update(`${result.stderrLines.join("\n")}\n`)
						.digest("hex"),
		) &&
		mementoArchiveErrors.every((error) => error.archive !== null) &&
		mementoArchiveErrors.filter(
			(error) => error.archive === "waext.banq.qc.ca",
		).length === 22 &&
		hasExactValues(
			mementoArchiveErrors
				.filter((error) => error.archive === "web.archive.org")
				.map((error) => error.label),
			["mapakm5", "mapatermicoyb6xb3"],
		) &&
		mementoArchiveErrors.length === 24 &&
		mementoEvidence?.summary?.targets === mementoResults.length &&
		mementoEvidence?.summary?.mementos ===
			mementoResults.reduce(
				(sum, result) => sum + result.mementos.length,
				0,
			) &&
		mementoEvidence?.summary?.timeouts === 0 &&
		mementoEvidence?.summary?.queriesWithArchiveErrors ===
			mementoResults.filter((result) => result.stderrLines.length > 0).length,
	"the Memento continuation must retain all exact targets, empty results and archive errors",
);
const continuationIdAttempts =
	missingMediaContinuation?.imageShackIdRoutes?.attempts ?? [];
const expectedContinuationIdRoutes = [
	"id-only-original-dimensions",
	"id-only-original-dimensions-png-extension",
];
check(
	hasExactValues(
		continuationIdAttempts.map(
			(attempt) => `${attempt.asset}\0${attempt.route}`,
		),
		[...expectedImageshackTargets.keys()].flatMap((asset) =>
			expectedContinuationIdRoutes.map((route) => `${asset}\0${route}`),
		),
	) &&
		continuationIdAttempts.every((attempt) => {
			const expected = expectedImageshackTargets.get(attempt.asset);
			if (!expected) return false;
			const [id, width, height] = expected;
			const extension = attempt.route.endsWith("png-extension") ? ".png" : "";
			return (
				attempt.imageId === id &&
				attempt.url ===
					`https://imagizer.imageshack.com/v2/${width}x${height}q100/${id}${extension}` &&
				attempt.httpStatus === 200 &&
				attempt.declaredContentLength === "0" &&
				attempt.contentLength === 0 &&
				attempt.sha256 === emptySha256 &&
				attempt.first32Hex === "" &&
				attempt.binarySignature == null &&
				attempt.contentType ===
					(extension ? "image/png" : "application/octet-stream")
			);
		}) &&
		missingMediaContinuation?.imageShackIdRoutes?.summary?.attempts ===
			continuationIdAttempts.length &&
		missingMediaContinuation?.imageShackIdRoutes?.summary?.errors === 0 &&
		missingMediaContinuation?.imageShackIdRoutes?.summary?.validImages === 0 &&
		missingMediaContinuation?.imageShackIdRoutes?.summary?.emptyBodies ===
			continuationIdAttempts.length,
	"the continuation must not promote ImageShack's empty 200 responses to images",
);
const continuationHostingQueries =
	missingMediaContinuation?.publicAuthorHosting?.apiQueries ?? [];
const continuationHostingQuery = (label) =>
	continuationHostingQueries.find((query) => query.label === label);
const continuationSourceForgeTrees =
	missingMediaContinuation?.publicAuthorHosting?.sourceForgeCurrentTrees ?? [];
const expectedSourceForgeCurrentTrees = new Map([
	[
		"olimposgames",
		[
			"https://sourceforge.net/p/olimposgames/code/HEAD/tree/documentacao/base/livro-cpp.7z",
		],
	],
	[
		"pmdd",
		[
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/caixote.blend",
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/casa3.blend",
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/license.txt",
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/poco.blend",
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/poco2.blend",
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/rocha.blend",
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/stone%202.blend",
			"https://sourceforge.net/p/pmdd/code/HEAD/tree/3D/models/ambient/stone1.blend",
		],
	],
]);
const missingTargetFilenamePattern =
	/(?:scheduler|physicsfs|sdl-physicsfs|boostconfig1|boostinstaller2|unixsextafeira13|desktop\.jpg|msvczm8|msvc9mb0|2242002764ab16f49f4dofs2|finalor9|mapakm5|mapatermicoyb6xb3)/i;
check(
	hasExactValues(
		continuationHostingQueries.map((query) => query.label),
		[
			"gitlab-user",
			"gitlab-public-projects",
			"bitbucket-public-repositories",
			"bitbucket-demo-tree",
			"sourceforge-profile",
			"sourceforge-olimposgames-project",
			"sourceforge-pmdd-project",
		],
	) &&
		continuationHostingQueries.every(
			(query) => query.httpStatus === 200 && isSha256(query.sha256),
		) &&
		continuationHostingQuery("gitlab-user")?.derived?.ids?.[0] === 3345430 &&
		continuationHostingQuery("gitlab-public-projects")?.derived?.projects ===
			0 &&
		continuationHostingQuery("bitbucket-public-repositories")?.derived
			?.repositories === 1 &&
		hasExactValues(
			continuationHostingQuery("bitbucket-demo-tree")?.derived?.paths ?? [],
			["Demo01.pro", "MinhaClasse.cpp", "MinhaClasse.h", "main.cpp"],
		) &&
		hasExactValues(
			continuationSourceForgeTrees.map((tree) => tree.project),
			["olimposgames", "pmdd"],
		) &&
		continuationSourceForgeTrees.every((tree) => {
			const expectedPaths = expectedSourceForgeCurrentTrees.get(tree.project);
			const derivedTargetMatches = tree.paths.filter((file) =>
				missingTargetFilenamePattern.test(file),
			);
			return (
				expectedPaths &&
				tree.reachableFiles === tree.paths.length &&
				hasExactValues(tree.paths, expectedPaths) &&
				hasExactValues(tree.targetMatches ?? [], derivedTargetMatches) &&
				derivedTargetMatches.length === 0
			);
		}),
	"the continuation must retain its bounded public author-hosting inventory",
);
const continuationSummary = missingMediaContinuation?.summary;
const derivedContinuationRecoveredFiles = continuationIdAttempts.filter(
	(attempt) => attempt.binarySignature != null && attempt.contentLength > 0,
).length;
const derivedContinuationPayloadCandidates =
	derivedContinuationRecoveredFiles +
	fourArchiveFiles.reduce(
		(sum, archive) => sum + archive.search.matches,
		0,
	) +
	continuationSourceForgeTrees.reduce(
		(sum, tree) =>
			sum +
			tree.paths.filter((file) => missingTargetFilenamePattern.test(file)).length,
		0,
	);
check(
	continuationSummary?.recoveredFiles ===
		derivedContinuationRecoveredFiles &&
		continuationSummary?.payloadCandidates ===
			derivedContinuationPayloadCandidates &&
		continuationSummary?.mementoTargets === mementoResults.length &&
		continuationSummary?.mementosReported ===
			mementoEvidence?.summary?.mementos &&
		continuationSummary?.fourArchiveExtractedFiles ===
			fourArchiveEvidence?.extractedFiles &&
		continuationSummary?.fourArchiveExtractedBytes ===
			fourArchiveEvidence?.extractedBytes &&
		continuationSummary?.imageShackIdRouteAttempts ===
			continuationIdAttempts.length &&
		continuationSummary?.imageShackIdRouteEmptyBodies ===
			continuationIdAttempts.filter((attempt) => attempt.contentLength === 0)
				.length,
	"the continuation summary must be derived from its evidence records",
);
const expectedCrawlTargets = new Map([
	[
		"unixsextafeira13",
		"com,skhaz,www)/blog/wp-content/uploads/2009/02/unixsextafeira13",
	],
	[
		"boostconfig1",
		"com,skhaz,www)/blog/wp-content/uploads/2008/06/boostconfig1",
	],
	[
		"boostinstaller2",
		"com,skhaz,www)/blog/wp-content/uploads/2008/06/boostinstaller2",
	],
	["desktop", "com,skhaz,www)/blog/wp-content/uploads/2008/05/desktop"],
	[
		"msvczm8-wordpress",
		"com,skhaz,www)/blog/wp-content/uploads/2008/05/msvczm8",
	],
	["scheduler", "com,skhaz,www)/blog/wp-content/uploads/2008/06/scheduler"],
	["physicsfs", "com,skhaz,www)/blog/wp-content/uploads/2008/04/physicsfs"],
	[
		"sdl-physicsfs",
		"com,skhaz,www)/blog/wp-content/uploads/2008/04/sdl-physicsfs",
	],
	[
		"unixsextafeira13-no-www",
		"com,skhaz)/blog/wp-content/uploads/2009/02/unixsextafeira13",
	],
	[
		"boostconfig1-no-www",
		"com,skhaz)/blog/wp-content/uploads/2008/06/boostconfig1",
	],
	[
		"boostinstaller2-no-www",
		"com,skhaz)/blog/wp-content/uploads/2008/06/boostinstaller2",
	],
	["desktop-no-www", "com,skhaz)/blog/wp-content/uploads/2008/05/desktop"],
	[
		"msvczm8-wordpress-no-www",
		"com,skhaz)/blog/wp-content/uploads/2008/05/msvczm8",
	],
	["scheduler-no-www", "com,skhaz)/blog/wp-content/uploads/2008/06/scheduler"],
	["physicsfs-no-www", "com,skhaz)/blog/wp-content/uploads/2008/04/physicsfs"],
	[
		"sdl-physicsfs-no-www",
		"com,skhaz)/blog/wp-content/uploads/2008/04/sdl-physicsfs",
	],
	["msvczm8-imageshack", "us,imageshack,img91)/img91/9260/msvczm8"],
	["msvc9mb0", "us,imageshack,img406)/img406/7664/msvc9mb0"],
	[
		"2242002764ab16f49f4dofs2",
		"us,imageshack,img405)/img405/1079/2242002764ab16f49f4dofs2",
	],
	["finalor9", "us,imageshack,img261)/img261/2865/finalor9"],
	["mapakm5", "us,imageshack,img240)/img240/2306/mapakm5"],
	["mapatermicoyb6xb3", "us,imageshack,img240)/img240/9194/mapatermicoyb6xb3"],
]);
const summarizeCrawlSweep = (manifest) => {
	const collections = manifest?.collections ?? [];
	const targets = manifest?.targets ?? [];
	const queries = manifest?.queries ?? [];
	const collectionIds = collections.map((collection) => collection.id);
	const targetLabels = targets.map((target) => target.label);
	const expectedQueryKeys = collectionIds.flatMap((collection) =>
		targetLabels.map((target) => `${collection}\0${target}`),
	);
	const queryKeys = queries.map(
		(query) => `${query.collection}\0${query.target}`,
	);
	const uniqueBlocks = new Map();
	let queryStructureIsValid = hasExactValues(queryKeys, expectedQueryKeys);
	for (const query of queries) {
		const expectedPrefix = expectedCrawlTargets.get(query.target);
		const [lowerBlock, upperBlock] = query.boundingBlocks ?? [];
		const boundsBracketPrefix =
			lowerBlock?.clusterKey <= expectedPrefix &&
			expectedPrefix < upperBlock?.clusterKey;
		const boundsAreConsecutive =
			Number.isInteger(lowerBlock?.block) &&
			upperBlock?.block === lowerBlock.block + 1;
		const sameFileRangesAreContiguous =
			lowerBlock?.cdxFile !== upperBlock?.cdxFile ||
			lowerBlock.offset + lowerBlock.length === upperBlock.offset;
		queryStructureIsValid &&=
			expectedPrefix === query.surtPrefix &&
			query.matches === 0 &&
			Array.isArray(query.boundingBlocks) &&
			query.boundingBlocks.length === 2 &&
			boundsBracketPrefix &&
			boundsAreConsecutive &&
			sameFileRangesAreContiguous;
		for (const block of query.boundingBlocks ?? []) {
			const end = block.offset + block.length - 1;
			queryStructureIsValid &&=
				block.length > 0 &&
				block.offset >= 0 &&
				block.rangeHeader === `bytes=${block.offset}-${end}` &&
				block.rangeUrl.includes(`/${query.collection}/`) &&
				block.rangeUrl.endsWith(`/${block.cdxFile}`) &&
				isSha256(block.compressedSha256);
			const blockKey = `${query.collection}\0${block.cdxFile}\0${block.offset}\0${block.length}`;
			const blockSignature = [
				block.clusterKey,
				block.block,
				block.rangeUrl,
				block.rangeHeader,
				block.compressedSha256,
			].join("\0");
			const previousBlock = uniqueBlocks.get(blockKey);
			queryStructureIsValid &&=
				previousBlock == null || previousBlock.signature === blockSignature;
			uniqueBlocks.set(blockKey, {
				length: block.length,
				signature: blockSignature,
			});
		}
	}
	const targetStructureIsValid =
		hasExactValues(targetLabels, [...expectedCrawlTargets.keys()]) &&
		targets.every(
			(target) => expectedCrawlTargets.get(target.label) === target.surtPrefix,
		);
	const collectionStructureIsValid =
		collectionIds.length === new Set(collectionIds).size &&
		collections.every(
			(collection) =>
				collection.clusterIndexUrl.includes(`/${collection.id}/`) &&
				collection.clusterIndexLength > 0 &&
				collection.clusterRows > 0 &&
				isSha256(collection.clusterIndexSha256),
		);
	return {
		valid:
			targetStructureIsValid &&
			collectionStructureIsValid &&
			queryStructureIsValid,
		collectionIds,
		queries: queries.length,
		uniqueCdxBlocks: uniqueBlocks.size,
		cdxCompressedBytes: [...uniqueBlocks.values()].reduce(
			(sum, block) => sum + block.length,
			0,
		),
		clusterIndexBytes: collections.reduce(
			(sum, collection) => sum + collection.clusterIndexLength,
			0,
		),
	};
};
const advertisedCollectionIds = [
	...new Set(
		commonCrawlCollectionsSource
			.toString("utf8")
			.match(/CC-MAIN-(?:2008-2009|2009-2010|2012|\d{4}-\d{2})/g) ?? [],
	),
];
const earlyCrawlDerived = summarizeCrawlSweep(commonCrawlEarlySweep);
const remainingCrawlDerived = summarizeCrawlSweep(commonCrawlRemainingSweep);
const allCrawlCollectionIds = [
	...earlyCrawlDerived.collectionIds,
	...remainingCrawlDerived.collectionIds,
];
const earlyArcScans = commonCrawlEarlySweep?.fullArcScans ?? [];
const arcCompressedBytes = earlyArcScans.reduce(
	(sum, scan) => sum + scan.compressedLength,
	0,
);
const arcUncompressedBytes = earlyArcScans.reduce(
	(sum, scan) => sum + scan.uncompressedBytesScanned,
	0,
);
const arcMatchingHeaders = earlyArcScans.reduce(
	(sum, scan) =>
		sum +
		Object.values(scan.matchingArcRecordHeaders ?? {}).reduce(
			(headerSum, count) => headerSum + count,
			0,
		),
	0,
);
check(
	earlyCrawlDerived.valid &&
		remainingCrawlDerived.valid &&
		hasExactValues(allCrawlCollectionIds, advertisedCollectionIds) &&
		advertisedCollectionIds.length === 125 &&
		commonCrawlCollectionsSource.length ===
			commonCrawlRemainingSweep?.inventory?.length &&
		createHash("sha256").update(commonCrawlCollectionsSource).digest("hex") ===
			commonCrawlRemainingSweep?.inventory?.sha256 &&
		commonCrawlRemainingSweep?.inventory?.advertisedCollections ===
			advertisedCollectionIds.length &&
		commonCrawlEarlySweep?.summary?.collections ===
			earlyCrawlDerived.collectionIds.length &&
		commonCrawlEarlySweep?.summary?.queries === earlyCrawlDerived.queries &&
		commonCrawlEarlySweep?.summary?.uniqueCdxBlocks ===
			earlyCrawlDerived.uniqueCdxBlocks &&
		commonCrawlEarlySweep?.summary?.cdxCompressedBytes ===
			earlyCrawlDerived.cdxCompressedBytes &&
		commonCrawlEarlySweep?.summary?.clusterIndexBytes ===
			earlyCrawlDerived.clusterIndexBytes &&
		commonCrawlEarlySweep?.summary?.matches === 0 &&
		commonCrawlEarlySweep?.summary?.errors === 0 &&
		commonCrawlEarlySweep?.summary?.fullArcFiles === earlyArcScans.length &&
		commonCrawlEarlySweep?.summary?.fullArcCompressedBytes ===
			arcCompressedBytes &&
		commonCrawlEarlySweep?.summary?.fullArcUncompressedBytesScanned ===
			arcUncompressedBytes &&
		commonCrawlEarlySweep?.summary?.matchingArcRecordHeaders ===
			arcMatchingHeaders &&
		commonCrawlRemainingSweep?.summary?.collectionsExpected ===
			remainingCrawlDerived.collectionIds.length &&
		commonCrawlRemainingSweep?.summary?.collectionsCompleted ===
			remainingCrawlDerived.collectionIds.length &&
		commonCrawlRemainingSweep?.summary?.queries ===
			remainingCrawlDerived.queries &&
		commonCrawlRemainingSweep?.summary?.uniqueCdxBlocks ===
			remainingCrawlDerived.uniqueCdxBlocks &&
		commonCrawlRemainingSweep?.summary?.cdxCompressedBytes ===
			remainingCrawlDerived.cdxCompressedBytes &&
		commonCrawlRemainingSweep?.summary?.clusterIndexBytes ===
			remainingCrawlDerived.clusterIndexBytes &&
		earlyCrawlDerived.queries + remainingCrawlDerived.queries === 2750 &&
		earlyCrawlDerived.uniqueCdxBlocks +
			remainingCrawlDerived.uniqueCdxBlocks ===
			723 &&
		earlyCrawlDerived.cdxCompressedBytes +
			remainingCrawlDerived.cdxCompressedBytes ===
			117492051 &&
		earlyCrawlDerived.clusterIndexBytes +
			remainingCrawlDerived.clusterIndexBytes ===
			15980084528 &&
		commonCrawlRemainingSweep?.summary?.matches === 0 &&
		commonCrawlRemainingSweep?.summary?.errors === 0 &&
		(commonCrawlRemainingSweep?.hits ?? []).length === 0 &&
		(commonCrawlRemainingSweep?.errors ?? []).length === 0,
	"the raw Common Crawl entries must derive exact 125-index Cartesian coverage without target locators",
);
const installerDigestBase32 =
	boostInstallerEvidence?.waybackCapture?.cdxDigestBase32Sha1 ?? "";
const installerDigestHex = decodeBase32Hex(installerDigestBase32);
check(
	decodeBase32Hex(`${installerDigestBase32}A`) == null &&
		decodeBase32Hex(installerDigestBase32.toLowerCase()) == null &&
		decodeBase32Hex(`${installerDigestBase32}=`) == null,
	"CDX SHA-1 decoding must reject noncanonical Base32 encodings",
);
check(
	boostInstallerEvidence?.waybackCapture?.timestamp === "20081113215056" &&
		boostInstallerEvidence?.payloadValidation?.downloadedEntityLength ===
			191672 &&
		boostInstallerEvidence?.payloadValidation?.magicHexPrefix?.startsWith(
			"4d5a",
		) &&
		installerDigestHex ===
			boostInstallerEvidence?.waybackCapture?.cdxDigestHexSha1 &&
		installerDigestHex === boostInstallerEvidence?.payloadValidation?.sha1 &&
		boostInstallerEvidence?.payloadValidation?.sha256 ===
			"a450ec3449f701a6a97584cb6c1c04bf3ee87d5694ed7fff29a216fd1d1b9946" &&
		boostInstallerEvidence?.payloadValidation?.execution ===
			"The executable was never launched." &&
		boostInstallerEvidence?.historicalLinkCdxResult?.status200Rows === 0,
	"the BoostPro installer evidence must retain independently cross-checked byte verification and hostname qualification",
);
const beforePerformance = highlightingPerformance?.revisions?.before;
const afterPerformance = highlightingPerformance?.revisions?.after;
const performanceDelta = highlightingPerformance?.delta;
const roundTo = (value, digits) => {
	const scale = 10 ** digits;
	return Math.round(value * scale) / scale;
};
const measuredMedian = (values) => {
	const sorted = [...values].sort((left, right) => left - right);
	return sorted[Math.floor(sorted.length / 2)];
};
const measuredMean = (values) =>
	roundTo(values.reduce((sum, value) => sum + value, 0) / values.length, 3);
const sizeDeltaMatches = (group, rawKey, gzipKey) =>
	performanceDelta?.[rawKey] ===
		afterPerformance?.[group]?.rawBytes -
			beforePerformance?.[group]?.rawBytes &&
	performanceDelta?.[gzipKey] ===
		afterPerformance?.[group]?.gzipBytes -
			beforePerformance?.[group]?.gzipBytes;
const expectedAffectedPostPaths = posts
	.filter((post) => countCppBlocks(post.html) > 0)
	.map((post) => `blog/${post.slug}/index.html`);
check(
	highlightingPerformance?.schemaVersion === 1 &&
		highlightingPerformance?.environment?.runs === 15 &&
		beforePerformance?.git === "6cbad9c16fb95ba7bee754d40847b4964f4a2274" &&
		beforePerformance?.buildMilliseconds?.length === 15 &&
		afterPerformance?.buildMilliseconds?.length === 15 &&
		measuredMedian(beforePerformance.buildMilliseconds) ===
			beforePerformance.buildMedianMilliseconds &&
		measuredMedian(afterPerformance.buildMilliseconds) ===
			afterPerformance.buildMedianMilliseconds &&
		measuredMean(beforePerformance.buildMilliseconds) ===
			beforePerformance.buildMeanMilliseconds &&
		measuredMean(afterPerformance.buildMilliseconds) ===
			afterPerformance.buildMeanMilliseconds &&
		performanceDelta?.buildMedianMilliseconds ===
			roundTo(
				afterPerformance.buildMedianMilliseconds -
					beforePerformance.buildMedianMilliseconds,
				3,
			) &&
		performanceDelta?.buildMedianPercent ===
			roundTo(
				(afterPerformance.buildMedianMilliseconds /
					beforePerformance.buildMedianMilliseconds -
					1) *
					100,
				2,
			) &&
		afterPerformance.buildMedianMilliseconds <
			beforePerformance.buildMedianMilliseconds &&
		sizeDeltaMatches("dist", "distRawBytes", "distGzipBytes") &&
		sizeDeltaMatches("html", "htmlRawBytes", "htmlGzipBytes") &&
		sizeDeltaMatches(
			"codePostHtml",
			"codePostHtmlRawBytes",
			"codePostHtmlGzipBytes",
		) &&
		sizeDeltaMatches("styleCss", "styleRawBytes", "styleGzipBytes") &&
		sizeDeltaMatches("appJs", "appRawBytes", "appGzipBytes") &&
		hasExactValues(
			highlightingPerformance?.affectedPostPaths ?? [],
			expectedAffectedPostPaths,
		) &&
		highlightingPerformance.affectedPostPaths.every((relativePath) =>
			existsSync(path.join(DIST, relativePath)),
		) &&
		performanceDelta.buildMedianMilliseconds === -29.361 &&
		performanceDelta.buildMedianPercent === -20.45 &&
		performanceDelta.distRawBytes === 38883 &&
		performanceDelta.distGzipBytes === 4486 &&
		performanceDelta.codePostHtmlRawBytes === 35235 &&
		performanceDelta.codePostHtmlGzipBytes === 3366 &&
		performanceDelta.styleGzipBytes === 536 &&
		performanceDelta.appGzipBytes === 584,
	"the highlighting performance manifest must derive every published before/after value",
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
		post.slug === "classe-stdstring-stl-no-vc-6-provoca-corrupcao-da-memoria",
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
		'Estou mudando de domínio, o novo endereço será <a href="http://www.skhaz.com/"',
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
					unsafeActiveHtml.test(comment.html) ||
					/<iframe\b/i.test(comment.html),
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
		const expectedPostBlocks = countCppBlocks(post.html);
		const renderedBlocks = html.match(/class="code-sample"/g)?.length ?? 0;
		const copyButtons = html.match(/data-copy-code/g)?.length ?? 0;
		const highlightedCode = [
			...html.matchAll(/<code class="hljs language-cpp">([\s\S]*?)<\/code>/gi),
		];
		check(
			renderedBlocks === expectedPostBlocks &&
				copyButtons === expectedPostBlocks &&
				highlightedCode.length === expectedPostBlocks,
			`generated C++ block count is inconsistent: ${post.slug}`,
		);
		check(
			highlightedCode.every((match) => !match[1].includes("\t")) &&
				!html.includes("syntax-highlight:cpp") &&
				!html.includes('class="wp_syntax"'),
			`generated C++ must use normalized indentation and static highlighting: ${post.slug}`,
		);
	}
}

const indentationFixture = readFileSync(
	path.join(DIST, "blog", "eliminando-o-codigo-fonfarrao", "index.html"),
	"utf8",
)
	.replace(/<[^>]*>/g, "")
	.replaceAll("&lt;", "<")
	.replaceAll("&gt;", ">")
	.replaceAll("&amp;", "&");
check(
	indentationFixture.includes(
		"class Deleter\n{\npublic:\n    void operator()(T* ptr)\n    {\n        if (ptr != NULL) {\n            delete ptr;",
	),
	"C++ indentation must consistently follow four-space nesting",
);
check(
	indentationFixture.includes("std::mem_fun(&Keyboard::teardown)") &&
		indentationFixture.includes("std::mem_fun(&Mouse::teardown)"),
	"double-encoded C++ ampersands must be normalized from archived HTML",
);
const alphaLoaderFixture = readFileSync(
	path.join(
		DIST,
		"blog",
		"carregando-imagens-com-ou-sem-canal-alpha",
		"index.html",
	),
	"utf8",
)
	.replace(/<[^>]*>/g, "")
	.replaceAll("&lt;", "<")
	.replaceAll("&gt;", ">")
	.replaceAll("&amp;", "&");
check(
	alphaLoaderFixture.includes("const string& filename"),
	"archived C++ entity layers must decode to the displayed token",
);
const schedulerFixture = readFileSync(
	path.join(DIST, "blog", "agendamento-de-tarefas", "index.html"),
	"utf8",
)
	.replace(/<[^>]*>/g, "")
	.replaceAll("&lt;", "<")
	.replaceAll("&gt;", ">")
	.replaceAll("&amp;", "&");
check(
	schedulerFixture.includes("#include <boost /function.hpp>") &&
		schedulerFixture.includes("#include </boost><boost /bind.hpp>") &&
		schedulerFixture.includes("shared_ptr</task><task>") &&
		schedulerFixture.includes(
			"if (it == _task_pool.end())\n        {\n            _task_pool.push_back(_task);\n        }",
		),
	"unattested historical C++ corruption must remain literal rather than reconstructed",
);
const virtualFilesystemFixture = readFileSync(
	path.join(DIST, "blog", "sistema-de-arquivo-virtual", "index.html"),
	"utf8",
)
	.replace(/<[^>]*>/g, "")
	.replaceAll("&lt;", "<")
	.replaceAll("&gt;", ">")
	.replaceAll("&quot;", '"')
	.replaceAll("&amp;", "&");
check(
	virtualFilesystemFixture.includes(
		'for (i = rc; *i != NULL; i++)\n    printf("%s\\n", *i);',
	),
	"generated C++ must preserve the level of the historical unbraced loop body",
);

const migrationFile = path.join(
	DIST,
	MIGRATION_ROUTE.replace(/^\//, "").replace(/\/$/, ""),
	"index.html",
);
check(
	existsSync(migrationFile),
	"missing generated predecessor migration page",
);
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
const generatedFiles = [];
const walk = (directory) => {
	for (const name of readdirSync(directory)) {
		const file = path.join(directory, name);
		if (statSync(file).isDirectory()) {
			walk(file);
		} else {
			generatedFiles.push(file);
			if (name.endsWith(".html")) htmlFiles.push(file);
		}
	}
};
walk(DIST);
const currentTreeRecords = generatedFiles
	.map((file) => ({
		file,
		relativePath: path.relative(DIST, file).split(path.sep).join("/"),
	}))
	.sort((left, right) => {
		if (left.relativePath < right.relativePath) return -1;
		if (left.relativePath > right.relativePath) return 1;
		return 0;
	})
	.map(({ file, relativePath }) => {
		const content = readFileSync(file);
		const digest = createHash("sha256").update(content).digest("hex");
		return `${relativePath}\0${content.length}\0${digest}\n`;
	});
const currentTreeSha256 = createHash("sha256")
	.update(currentTreeRecords.join(""))
	.digest("hex");
check(
	currentTreeSha256 === afterPerformance?.treeSha256 &&
		generatedFiles.length === afterPerformance?.dist?.files &&
		generatedFiles.reduce((sum, file) => sum + statSync(file).size, 0) ===
			afterPerformance?.dist?.rawBytes &&
		htmlFiles.length === afterPerformance?.html?.files &&
		htmlFiles.reduce((sum, file) => sum + statSync(file).size, 0) ===
			afterPerformance?.html?.rawBytes,
	"the measured after-performance revision must match the current generated tree",
);

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
check(
	stylesheet.includes(".code-sample") &&
		stylesheet.includes(".hljs-keyword") &&
		stylesheet.includes("tab-size: 4"),
	"the generated stylesheet must include the C++ presentation theme",
);
const clientScript = readFileSync(path.join(DIST, "assets", "app.js"), "utf8");
check(
	clientScript.includes("[data-copy-code]") &&
		clientScript.includes("navigator.clipboard") &&
		clientScript.includes('document.execCommand("copy")'),
	"the generated client script must support modern and portable-static code copying",
);
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
	`Validated ${posts.length} posts, ${expectedCppBlockCount} highlighted C++ blocks, ${predecessorPosts.length} predecessor record, 72 complete comments (82 recorded), ${htmlFiles.length} HTML pages and all local references.\n`,
);
