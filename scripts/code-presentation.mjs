import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";

hljs.registerLanguage("cpp", cpp);

const NAMED_CODE_ENTITIES = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
};

const DOUBLE_ENCODED_CPP_BLOCKS = new Set([
	"eliminando-o-codigo-fonfarrao:2",
	"carregando-imagens-com-ou-sem-canal-alpha:1",
	"carregando-imagens-com-ou-sem-canal-alpha:2",
]);

const decodeCodePoint = (source, value, radix) => {
	const codePoint = Number.parseInt(value, radix);
	if (
		!Number.isInteger(codePoint) ||
		codePoint < 0 ||
		codePoint > 0x10ffff ||
		(codePoint >= 0xd800 && codePoint <= 0xdfff)
	) {
		return source;
	}
	return String.fromCodePoint(codePoint);
};

export const decodeCodeEntitiesOnce = (value) =>
	value
		.replace(/&#x([0-9a-f]+);/gi, (source, hex) =>
			decodeCodePoint(source, hex, 16),
		)
		.replace(/&#(\d+);/g, (source, decimal) =>
			decodeCodePoint(source, decimal, 10),
		)
		.replace(
			/&(amp|lt|gt|quot|apos|nbsp);/gi,
			(_, entity) => NAMED_CODE_ENTITIES[entity.toLowerCase()],
		);

const codeSyntaxWithoutLiterals = (line, state) => {
	let syntax = "";
	let quote = "";
	let escaped = false;
	for (let index = 0; index < line.length; index += 1) {
		const character = line[index];
		const next = line[index + 1];
		if (state.inBlockComment) {
			if (character === "*" && next === "/") {
				state.inBlockComment = false;
				index += 1;
			}
			continue;
		}
		if (quote) {
			if (escaped) escaped = false;
			else if (character === "\\") escaped = true;
			else if (character === quote) quote = "";
			continue;
		}
		if (character === "/" && next === "/") break;
		if (character === "/" && next === "*") {
			state.inBlockComment = true;
			index += 1;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		syntax += character;
	}
	return syntax.trim();
};

const formatCppIndentation = (value) => {
	const lines = value
		.replace(/\r\n?/g, "\n")
		.replaceAll("\u00a0", " ")
		.split("\n")
		.map((line) => line.replace(/\s+$/g, ""));
	while (lines[0]?.trim() === "") lines.shift();
	while (lines.at(-1)?.trim() === "") lines.pop();

	const formatted = [];
	const syntaxState = { inBlockComment: false };
	let depth = 0;
	let continuation = false;
	let unbracedBodyDepth = 0;
	for (const line of lines) {
		const content = line.trimStart();
		if (!content) {
			formatted.push("");
			continuation = false;
			continue;
		}
		if (content.startsWith("#")) {
			formatted.push(content);
			continuation = content.endsWith("\\");
			continue;
		}

		const syntax = codeSyntaxWithoutLiterals(content, syntaxState);
		const leadingClosers = syntax.match(/^}+/)?.[0].length ?? 0;
		const inheritedUnbracedDepth = syntax.startsWith("{")
			? 0
			: unbracedBodyDepth;
		unbracedBodyDepth = 0;
		let lineDepth =
			Math.max(0, depth - leadingClosers) + inheritedUnbracedDepth;
		if (/^(?:public|protected|private)\s*:/.test(syntax)) {
			lineDepth = Math.max(0, lineDepth - 1);
		} else if (/^(?:case\b.*|default)\s*:/.test(syntax)) {
			lineDepth = Math.max(0, lineDepth - 1);
		} else if (continuation && !/^[})\]]/.test(syntax)) {
			lineDepth += 1;
		}
		formatted.push(`${"    ".repeat(lineDepth)}${content}`);

		const openingBraces = (syntax.match(/{/g) ?? []).length;
		const closingBraces = (syntax.match(/}/g) ?? []).length;
		depth = Math.max(0, depth + openingBraces - closingBraces);
		const startsUnbracedBody =
			/^(?:if|for|while|switch)\s*\(.*\)\s*$/.test(syntax) ||
			/^else(?:\s+if\s*\(.*\))?\s*$/.test(syntax) ||
			/^do\s*$/.test(syntax);
		if (startsUnbracedBody) {
			unbracedBodyDepth = inheritedUnbracedDepth + 1;
		}
		continuation =
			!/[;{}:]\s*$/.test(syntax) && /(?:[,=(+\-*/%&|?]|<<|>>)\s*$/.test(syntax);
	}
	return formatted.join("\n");
};

export const normalizeCppCode = (rawCode, { decodeTwice = false } = {}) => {
	const encodedCode = rawCode
		.replace(/<br\s*\/?\s*>/gi, "\n")
		.replace(/<\/?span\b[^>]*>/gi, "");
	const decodedOnce = decodeCodeEntitiesOnce(encodedCode);
	const decodedCode = decodeTwice
		? decodeCodeEntitiesOnce(decodedOnce)
		: decodedOnce;
	return formatCppIndentation(decodedCode);
};

let highlightedCodeBlockCount = 0;

const renderCppCode = (rawCode, decodeTwice) => {
	const code = normalizeCppCode(rawCode, { decodeTwice });
	const highlighted = hljs.highlight(code, {
		language: "cpp",
		ignoreIllegals: true,
	}).value;
	highlightedCodeBlockCount += 1;
	return `<figure class="code-sample" data-language="C++" data-indent-size="4">
  <figcaption class="code-toolbar"><span class="code-language">C++</span><button class="copy-code" type="button" data-copy-code><span aria-live="polite">Copiar código</span></button></figcaption>
  <pre class="code-source" tabindex="0"><code class="hljs language-cpp">${highlighted}</code></pre>
</figure>`;
};

export const enhanceCodeBlocks = (html, postSlug) => {
	let blockIndex = 0;
	const renderNextCppBlock = (code) => {
		blockIndex += 1;
		const decodeTwice = DOUBLE_ENCODED_CPP_BLOCKS.has(
			`${postSlug}:${blockIndex}`,
		);
		return renderCppCode(code, decodeTwice);
	};
	return html
		.replace(
			/<div class="wp_syntax">[\s\S]*?<td class="code"><pre\b[^>]*>([\s\S]*?)<\/pre><\/td>[\s\S]*?<\/table><\/div>/gi,
			(_, code) => renderNextCppBlock(code),
		)
		.replace(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/gi, (block, attributes, code) =>
			/(?:syntax-highlight:cpp|class="cpp")/i.test(attributes)
				? renderNextCppBlock(code)
				: block,
		);
};

export const getHighlightedCodeBlockCount = () => highlightedCodeBlockCount;
