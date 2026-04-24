export type MessageRole = "user" | "assistant" | "system";

export type ContentType = "text" | "chart" | "table" | "csv" | "link";

export interface MessageContent {
  type: ContentType;
  text: string;
  data?: unknown;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: MessageContent;
  latencyMs?: number;
  createdAt: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  createdAt: string;
  messages?: ChatMessage[];
}

// GraphQL request/response shapes
export interface CreateSessionResponse {
  createChatSession: ChatSession;
}

export interface GetSessionResponse {
  chatSession: ChatSession & { messages: ChatMessage[] };
}

export interface SendMessageResponse {
  sendMessage: ChatMessage;
}
