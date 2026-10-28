const lists = import.meta.glob("../data/cities/*.json", { import: "default" }) as Record<
  string,
  () => Promise<string[]>
>;

function fileFor(state: string) {
  const slug = state
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "");
  return `../data/cities/${slug}.json`;
}

export function loadCities(state: string): Promise<string[]> {
  const load = lists[fileFor(state)];
  if (!load) return Promise.resolve([]);
  return load().then((cities) => (Array.isArray(cities) ? cities : []));
}
