import supabase from "@/config/supabase";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Check for local mock user fallback
      const mockUser = localStorage.getItem("pace_mock_user") || localStorage.getItem("zenpulse_mock_user");
      if (mockUser) {
        try {
          const parsed = JSON.parse(mockUser);
          if (parsed?.id) {
            headers["x-mock-user-id"] = parsed.id;
            headers["x-mock-user-email"] = parsed.email || "";
          }
        } catch {
          // ignore
        }
      }
    }
  } catch (err) {
    console.warn("[API Client] Failed to retrieve session token:", err);
  }

  return headers;
}

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const authHeaders = await getAuthHeaders();

  const config = {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // response is not json
    }

    const message = errorData?.message || errorData?.error || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, errorData?.details || null);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "GET" });
  },
  post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "POST", body });
  },
  patch(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PATCH", body });
  },
  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "DELETE" });
  },
};
