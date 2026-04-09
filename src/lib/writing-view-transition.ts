function getWritingTransitionSlugId(slug: string[]): string {
  return slug.map(encodeURIComponent).join("--");
}

export function getWritingTitleTransitionName(slug: string[]): string {
  return `writing-title-${getWritingTransitionSlugId(slug)}`;
}
