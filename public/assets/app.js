const normalize = (value) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim();

const input = document.querySelector("[data-archive-search]");
const items = [...document.querySelectorAll("[data-search-item]")];
const searchStatus = document.querySelector("[data-search-status]");

if (input && items.length > 0) {
	const filterPosts = () => {
		const query = normalize(input.value);
		let visible = 0;

		for (const item of items) {
			const matches =
				!query || normalize(item.dataset.searchText ?? "").includes(query);
			item.hidden = !matches;
			if (matches) visible += 1;
		}

		if (searchStatus) {
			if (query) {
				const suffix = visible === 1 ? "" : "s";
				searchStatus.textContent = `${visible} resultado${suffix} encontrado${suffix}.`;
			} else {
				searchStatus.textContent = `${items.length} posts no arquivo.`;
			}
		}
	};

	const query = new URLSearchParams(window.location.search).get("q");
	if (query) input.value = query;
	input.addEventListener("input", filterPosts);
	filterPosts();
}

const copyCodeTextFallback = (text) => {
	const previouslyFocused = document.activeElement;
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.readOnly = true;
	textarea.setAttribute("aria-hidden", "true");
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.append(textarea);
	let copied = false;
	try {
		textarea.select();
		copied = document.execCommand("copy");
	} finally {
		textarea.remove();
		if (previouslyFocused instanceof HTMLElement) {
			previouslyFocused.focus({ preventScroll: true });
		}
	}
	if (!copied) throw new Error("Clipboard fallback failed");
};

const copyCodeText = async (text) => {
	if (navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return;
		} catch {
			// Continue with the portable static-page fallback.
		}
	}
	copyCodeTextFallback(text);
};

for (const button of document.querySelectorAll("[data-copy-code]")) {
	let resetTimer;
	button.addEventListener("click", async () => {
		const label = button.querySelector("span");
		const code = button.closest(".code-sample")?.querySelector("code");
		if (!label || !code) return;

		window.clearTimeout(resetTimer);
		try {
			await copyCodeText(code.textContent ?? "");
			label.textContent = "Copiado";
		} catch {
			label.textContent = "Não foi possível copiar";
		}
		resetTimer = window.setTimeout(() => {
			label.textContent = "Copiar código";
		}, 1800);
	});
}
