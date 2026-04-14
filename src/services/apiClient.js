const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ENV_TOKEN = import.meta.env.VITE_PINAI_TOKEN || "";

class ApiClientError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getAccessToken() {
  if (typeof window === "undefined") {
    return ENV_TOKEN;
  }

  return window.localStorage.getItem("pinai_access_token") || ENV_TOKEN;
}

async function request(path, options = {}, authRequired = false) {
  const token = getAccessToken();
  if (authRequired && !token) {
    throw new ApiClientError("Please log in to perform this action.", 401);
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || "Something went wrong while contacting the API.";
    throw new ApiClientError(message, response.status, payload?.details || null);
  }

  return payload;
}

export { ApiClientError, getAccessToken, request };
