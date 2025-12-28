export function setPageMetadata(title: string, description: string) {
  if (typeof document === "undefined") return;

  document.title = title;

  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = description;

  const href = window.location.origin + window.location.pathname;
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = href;
}
