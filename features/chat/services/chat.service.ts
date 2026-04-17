import { apiClient } from "@/lib/api-client";
import type {
  ChatSession,
  SendMessageRequest,
  SendMessageResponse,
} from "../types";

export const chatService = {
  async getSession(sessionId: string): Promise<ChatSession> {
    return apiClient.get<ChatSession>(`/chat/sessions/${sessionId}`);
  },

  async createSession(): Promise<ChatSession> {
    return apiClient.post<ChatSession>("/chat/sessions", {});
  },

  async sendMessage(payload: SendMessageRequest): Promise<SendMessageResponse> {
    return apiClient.post<SendMessageResponse>("/chat/messages", payload);
  },

  async getHistory(sessionId: string): Promise<ChatSession> {
    return apiClient.get<ChatSession>(`/chat/sessions/${sessionId}/history`);
  },
};
