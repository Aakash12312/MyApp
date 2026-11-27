const API_BASE = "http://localhost:5000";

export const csrfFetch = async (url, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const headers = { ...options.headers };

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const tokenResponse = await fetch(`${API_BASE}/csrf-token`, {
      credentials: "include",
    });
    if (!tokenResponse.ok) {
      throw new Error("Unable to obtain a CSRF token.");
    }

    const { csrfToken } = await tokenResponse.json();
    headers["X-CSRF-Token"] = csrfToken;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: options.credentials || "include",
  });
};
