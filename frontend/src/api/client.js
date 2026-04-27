const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("sjp_token");
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data !== null
        ? data.message || JSON.stringify(data)
        : data || "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body, options = {}) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options
    })
};

export { API_BASE_URL };
