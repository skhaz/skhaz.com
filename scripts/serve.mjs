import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
	"dist",
);
const PORT = Number.parseInt(process.env.PORT ?? "4173", 10);
const BASE_PATH = "/skhaz.com";
const MIME_TYPES = new Map([
	[".css", "text/css; charset=UTF-8"],
	[".gif", "image/gif"],
	[".html", "text/html; charset=UTF-8"],
	[".ico", "image/x-icon"],
	[".jpg", "image/jpeg"],
	[".jpeg", "image/jpeg"],
	[".js", "text/javascript; charset=UTF-8"],
	[".json", "application/json; charset=UTF-8"],
	[".png", "image/png"],
	[".svg", "image/svg+xml"],
	[".xml", "application/xml; charset=UTF-8"],
]);

const resolveRequest = async (requestPath) => {
	const decoded = decodeURIComponent(requestPath.split("?")[0]);
	const sitePath = decoded.startsWith(`${BASE_PATH}/`)
		? decoded.slice(BASE_PATH.length)
		: decoded === BASE_PATH
			? "/"
			: decoded;
	const relative = sitePath.replace(/^\/+/, "");
	const candidate = path.resolve(ROOT, relative);

	if (candidate !== ROOT && !candidate.startsWith(`${ROOT}${path.sep}`)) {
		return null;
	}

	try {
		const info = await stat(candidate);
		if (info.isDirectory()) return path.join(candidate, "index.html");
		return candidate;
	} catch {
		if (path.extname(candidate)) return null;
		try {
			const indexFile = path.join(candidate, "index.html");
			await stat(indexFile);
			return indexFile;
		} catch {
			return null;
		}
	}
};

const server = createServer(async (request, response) => {
	try {
		const file = await resolveRequest(request.url ?? "/");
		const target = file ?? path.join(ROOT, "404.html");
		const extension = path.extname(target).toLowerCase();
		const requestPath = (request.url ?? "").split("?")[0];
		const isFeed = requestPath === `${BASE_PATH}/blog/feed/`;

		response.statusCode = file ? 200 : 404;
		response.setHeader(
			"Content-Type",
			isFeed
				? "application/rss+xml; charset=UTF-8"
				: (MIME_TYPES.get(extension) ?? "application/octet-stream"),
		);
		response.setHeader("Cache-Control", "no-cache");
		createReadStream(target).pipe(response);
	} catch (error) {
		response.statusCode = 500;
		response.setHeader("Content-Type", "text/plain; charset=UTF-8");
		response.end(
			`Server error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
});

server.listen(PORT, "127.0.0.1", () => {
	process.stdout.write(
		`skhaz.com restoration: http://127.0.0.1:${PORT}${BASE_PATH}/blog/\n`,
	);
});
