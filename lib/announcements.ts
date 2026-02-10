export type AnnouncementType = "info" | "warning" | "success" | "event";

export type Announcement = {
  id: string;
  message: string;
  type: AnnouncementType;
  isActive: boolean;
  link?: string;
  linkText?: string;
  startAt?: string;
  endAt?: string;
  priority?: number;
  publishedAt?: string;
  createdAt?: string;
};

type MicroCMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const DEFAULT_ENDPOINT = "news";

const getEnv = (key: string) => process.env[key] ?? "";

const isWithinPeriod = (startAt?: string, endAt?: string) => {
  const now = Date.now();
  const start = startAt ? Date.parse(startAt) : Number.NaN;
  const end = endAt ? Date.parse(endAt) : Number.NaN;
  const isAfterStart = Number.isNaN(start) ? true : start <= now;
  const isBeforeEnd = Number.isNaN(end) ? true : end >= now;
  return isAfterStart && isBeforeEnd;
};

const normalizeType = (value: string | undefined): AnnouncementType => {
  if (value === "warning" || value === "success" || value === "event") return value;
  return "info";
};

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const serviceId = getEnv("NEXT_PUBLIC_MICROCMS_SERVICE_ID") || getEnv("MICROCMS_SERVICE_ID");
  const apiKey = getEnv("MICROCMS_API_KEY");
  const endpoint = getEnv("MICROCMS_ANNOUNCEMENTS_ENDPOINT") || DEFAULT_ENDPOINT;

  if (!serviceId || !apiKey) return [];

  const url = `https://${serviceId}.microcms.io/api/v1/${endpoint}?limit=50`;
  const res = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": apiKey },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch announcements:", res.status, res.statusText);
    return [];
  }

  const data = (await res.json()) as MicroCMSListResponse<Announcement>;
  const filtered = data.contents
    .map((item) => ({
      ...item,
      type: normalizeType(item.type),
      isActive: Boolean(item.isActive),
    }))
    .filter((item) => item.isActive && isWithinPeriod(item.startAt, item.endAt));

  return filtered.sort((a, b) => {
    const priorityDiff = (a.priority ?? 999) - (b.priority ?? 999);
    if (priorityDiff !== 0) return priorityDiff;
    const aTime = Date.parse(a.publishedAt || a.createdAt || "") || 0;
    const bTime = Date.parse(b.publishedAt || b.createdAt || "") || 0;
    return bTime - aTime;
  });
}
