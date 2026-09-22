function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export function getPublicStoreUrl(slug: string) {
  return `/store/${encodeURIComponent(normalizeSlug(slug))}`;
}
