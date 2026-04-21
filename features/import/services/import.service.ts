import type {
  BuildGraphResponse,
  EntityType,
  ImportJob,
  QuarantineResponse,
  UploadResponse,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  const schema = localStorage.getItem("tenant_schema");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(schema ? { "x-tenant-schema": schema } : {}),
  };
}

export const importService = {
  /**
   * Upload a CSV file for a given entity type.
   * Uses multipart/form-data — cannot use apiClient (no Content-Type: application/json).
   */
  async uploadCsv(file: File, entityType: EntityType): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityType", entityType);

    const response = await fetch(`${API_BASE_URL}/connectors/csv-upload`, {
      method: "POST",
      headers: getAuthHeaders(), // No Content-Type — browser sets multipart boundary
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? `Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  async getJobStatus(jobId: string): Promise<ImportJob> {
    const response = await fetch(`${API_BASE_URL}/connectors/jobs/${jobId}`, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? "Failed to get job status");
    }

    return response.json();
  },

  async getQuarantine(): Promise<QuarantineResponse> {
    const response = await fetch(`${API_BASE_URL}/connectors/quarantine`, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? "Failed to fetch quarantine records");
    }

    return response.json();
  },

  async buildGraph(): Promise<BuildGraphResponse> {
    const response = await fetch(`${API_BASE_URL}/connectors/build-graph`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? "Failed to build knowledge graph");
    }

    return response.json();
  },
};
