import { request } from "./apiClient";

function mapShapeClass(pinId) {
  const shapes = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]"];
  let hash = 0;

  for (let i = 0; i < pinId.length; i += 1) {
    hash = (hash << 5) - hash + pinId.charCodeAt(i);
    hash |= 0;
  }

  return shapes[Math.abs(hash) % shapes.length];
}

function normalizePin(apiPin) {
  const id = apiPin.id || apiPin._id;
  return {
    id,
    imageUrl: apiPin.imageUrl,
    title: apiPin.title,
    description: apiPin.description || "",
    tags: apiPin.tags || [],
    author: apiPin.author || null,
    liked: Boolean(apiPin.isLiked),
    saved: Boolean(apiPin.isSaved),
    likesCount: Number(apiPin.likesCount || 0),
    savesCount: Number(apiPin.savesCount || 0),
    shapeClass: mapShapeClass(String(id)),
    createdAt: apiPin.createdAt,
  };
}

export async function fetchPinsFeed({ page = 1, limit = 20, type = "latest" } = {}) {
  const payload = await request(`/pins/feed?type=${type}&page=${page}&limit=${limit}`);
  return {
    pins: (payload?.data?.pins || []).map(normalizePin),
    page: payload?.data?.page || page,
    hasMore: Boolean(payload?.data?.hasMore),
    total: payload?.data?.total || 0,
  };
}

export async function createPin(payload) {
  const apiPayload = {
    imageUrl: payload.imageUrl,
    title: payload.title,
    description: payload.description,
    tags: payload.tags,
  };

  const response = await request("/pins", { method: "POST", body: JSON.stringify(apiPayload) }, true);
  return normalizePin(response?.data?.pin);
}

export async function togglePinLike(pinId) {
  const response = await request(`/pins/${pinId}/like`, { method: "POST" }, true);
  return {
    isLiked: Boolean(response?.data?.isLiked),
    likesCount: Number(response?.data?.likesCount || 0),
  };
}

export async function togglePinSave(pinId) {
  const response = await request(`/pins/${pinId}/save`, { method: "POST" }, true);
  return {
    isSaved: Boolean(response?.data?.isSaved),
    savesCount: Number(response?.data?.savesCount || 0),
  };
}
