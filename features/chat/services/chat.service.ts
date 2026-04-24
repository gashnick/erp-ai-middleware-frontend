const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/graphql";

import type {
  ChatMessage,
  ChatSession,
  CreateSessionResponse,
  GetSessionResponse,
  SendMessageResponse,
} from "../types";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  const schema = localStorage.getItem("tenant_schema");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(schema ? { "x-tenant-schema": schema } : {}),
  };
}

async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }

  return json.data as T;
}

export const chatService = {
  async createSession(): Promise<ChatSession> {
    const data = await gql<CreateSessionResponse>(`
      mutation CreateChatSession {
        createChatSession {
          id
          createdAt
        }
      }
    `);
    return data.createChatSession;
  },

  async getSession(
    id: string,
  ): Promise<ChatSession & { messages: ChatMessage[] }> {
    const data = await gql<GetSessionResponse>(
      `
      query GetChatSession($id: ID!) {
        chatSession(id: $id) {
          id
          createdAt
          messages {
            id
            sessionId
            role
            content
            latencyMs
            createdAt
          }
        }
      }
    `,
      { id },
    );
    return data.chatSession;
  },

  async sendMessage(sessionId: string, text: string): Promise<ChatMessage> {
    const data = await gql<SendMessageResponse>(
      `
      mutation SendMessage($sessionId: ID!, $text: String!) {
        sendMessage(sessionId: $sessionId, text: $text) {
          id
          sessionId
          role
          content
          latencyMs
          createdAt
        }
      }
    `,
      { sessionId, text },
    );
    return data.sendMessage;
  },
};
