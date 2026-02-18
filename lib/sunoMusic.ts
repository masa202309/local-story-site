export type MusicRenderModel = {
  kind: "embed" | "audio" | "external";
  embedUrl?: string;
  audioUrl?: string;
  externalUrl: string;
  provider?: "suno";
};

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.+$/, "").replace(/^www\./, "");
}

function isSunoDotComHost(hostname: string): boolean {
  return hostname === "suno.com";
}

function isSunoCdnHost(hostname: string): boolean {
  return hostname === "suno.ai" || hostname.endsWith(".suno.ai");
}

function isMp3Path(pathname: string): boolean {
  return pathname.toLowerCase().endsWith(".mp3");
}

function createEmbedUrl(songId: string, search: string): string {
  const embedUrl = new URL(`https://suno.com/embed/${songId}`);
  embedUrl.search = search;
  return embedUrl.toString();
}

function getPathSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

function tryBuildSunoEmbedUrl(url: URL): string | null {
  const segments = getPathSegments(url.pathname);
  const [type, id] = segments;
  if (!id) return null;

  if (type === "song" || type === "embed") {
    return createEmbedUrl(id, url.search);
  }
  return null;
}

async function resolveSunoShortUrl(url: URL): Promise<URL | null> {
  try {
    const response = await fetch(url.toString(), { redirect: "manual", cache: "no-store" });
    const location = response.headers.get("location");
    if (location) {
      return new URL(location, url.toString());
    }
  } catch {
    // Ignore and fallback to redirect follow below.
  }

  try {
    const response = await fetch(url.toString(), { redirect: "follow", cache: "no-store" });
    if (response.url) {
      return new URL(response.url);
    }
  } catch {
    // Ignore and fallback to external link.
  }

  return null;
}

export async function buildMusicRenderModel(rawUrl: string): Promise<MusicRenderModel> {
  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) {
    return { kind: "external", externalUrl: rawUrl };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    return { kind: "external", externalUrl: trimmedUrl };
  }

  const externalUrl = parsedUrl.toString();
  const hostname = normalizeHostname(parsedUrl.hostname);
  const isSuno = isSunoDotComHost(hostname);
  const isSunoCdn = isSunoCdnHost(hostname);

  if (isMp3Path(parsedUrl.pathname)) {
    return {
      kind: "audio",
      audioUrl: externalUrl,
      externalUrl,
      provider: isSuno || isSunoCdn ? "suno" : undefined,
    };
  }

  if (!isSuno) {
    return {
      kind: "external",
      externalUrl,
      provider: isSunoCdn ? "suno" : undefined,
    };
  }

  const embedUrl = tryBuildSunoEmbedUrl(parsedUrl);
  if (embedUrl) {
    return {
      kind: "embed",
      embedUrl,
      externalUrl,
      provider: "suno",
    };
  }

  const segments = getPathSegments(parsedUrl.pathname);
  if (segments[0] === "s" && segments[1]) {
    const resolvedUrl = await resolveSunoShortUrl(parsedUrl);
    if (resolvedUrl) {
      const resolvedEmbedUrl = tryBuildSunoEmbedUrl(resolvedUrl);
      if (resolvedEmbedUrl) {
        return {
          kind: "embed",
          embedUrl: resolvedEmbedUrl,
          externalUrl: resolvedUrl.toString(),
          provider: "suno",
        };
      }

      return {
        kind: "external",
        externalUrl: resolvedUrl.toString(),
        provider: "suno",
      };
    }

    return {
      kind: "external",
      externalUrl,
      provider: "suno",
    };
  }

  return {
    kind: "external",
    externalUrl,
    provider: "suno",
  };
}
