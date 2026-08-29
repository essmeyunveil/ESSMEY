export function getImageUrl(source) {
  if (!source) return "/images/product-placeholder.jpg";
  if (typeof source === "string") return source;
  if (source && typeof source === "object" && source.asset && source.asset.url) {
    return source.asset.url;
  }
  return "/images/product-placeholder.jpg";
}
