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
