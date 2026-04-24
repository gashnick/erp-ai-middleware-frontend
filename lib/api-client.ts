import type { ApiError, ApiResponse } from "@/types/api.types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useToastStore } from "@/store/toast.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

class ApiClientError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiClientError";
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    // Token expired or invalid
    useAuthStore.getState().clearAuth();
    useToastStore
      .getState()
      .addToast(
        "Your session has expired. Please log in again.",
        "warning",
        5000,
      );
    window.location.href = "/login";
    throw new ApiClientError("Session expired", 401);
  }

  if (!response.ok) {
    let errorBody: ApiError;
    try {
      errorBody = await response.json();
    } catch {
      throw new ApiClientError(response.statusText, response.status);
    }
    throw new ApiClientError(
      errorBody.message ?? "Unknown error",
      errorBody.statusCode ?? response.status,
    );
  }

  const json = await response.json();

  // Debug log for invoices endpoint
  if (response.url.includes("/invoices")) {
    console.log("[API] /invoices response:", json);
  }

  // Backend returns direct response, no { data: ... } wrapper
  return json as T;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getTenantHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const schema = localStorage.getItem("tenant_schema");
  return schema ? { "x-tenant-schema": schema } : {};
}

function buildHeaders(extra?: Record<string, string>): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...getTenantHeader(),
    ...extra,
  };
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: buildHeaders(),
    });
    return parseResponse<T>(response);
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return parseResponse<T>(response);
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },
};
