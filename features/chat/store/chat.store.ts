import { create } from "zustand";
import type { ChatMessage } from "../types";

interface ChatState {
  sessionId: string | null;
  messages: ChatMessage[];
  isAwaitingResponse: boolean;
  setSessionId: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  appendStreamChunk: (messageId: string, chunk: string) => void;
  setIsAwaitingResponse: (isAwaiting: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessionId: null,
  messages: [],
  isAwaitingResponse: false,

  setSessionId: (id) => set({ sessionId: id }),

  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),

  appendStreamChunk: (messageId, chunk) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === messageId ? { ...m, content: m.content + chunk } : m,
      ),
    })),

  setIsAwaitingResponse: (isAwaiting) =>
    set({ isAwaitingResponse: isAwaiting }),

  clearMessages: () => set({ messages: [] }),
}));
