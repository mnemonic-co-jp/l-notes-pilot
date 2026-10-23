export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${year}年${month}月${day}日`;
}

export function countGlyphs(text: string): string {
  return text.replace(/\s/g, "");
}

export function glyphCount(text: string): number {
  return Array.from(countGlyphs(text)).length;
}

export function excerpt(body: string, length = 88): string {
  const flat = countGlyphs(body);
  const chars = Array.from(flat);
  if (chars.length <= length) return flat;
  return `${chars.slice(0, length).join("")}…`;
}

export function decadeOf(year: number): string {
  if (year < 1970) return "1950–60年代";
  if (year < 1980) return "1970年代";
  if (year < 1990) return "1980年代";
  return "1990年代";
}

export function amazonSearchUrl(query: string): string {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}`;
}

export function discogsSearchUrl(query: string): string {
  return `https://www.discogs.com/search/?type=release&q=${encodeURIComponent(query)}`;
}
