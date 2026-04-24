import { useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import { useChatStore } from "../store/chat.store";
import type { ChatMessage } from "../types";

export function useChatSession() {
  const {
    sessionId,
    messages,
    isAwaitingResponse,
    setSessionId,
    addMessage,
    setIsAwaitingResponse,
  } = useChatStore();

  const isInitializingRef = useRef(false);

  const createSessionMutation = useMutation({
    mutationFn: chatService.createSession,
    onSuccess: (session) => {
      setSessionId(session.id);
    },
  });

  const initSession = useCallback(async () => {
    if (sessionId || isInitializingRef.current) return;
    isInitializingRef.current = true;
    try {
      await createSessionMutation.mutateAsync();
    } finally {
      isInitializingRef.current = false;
    }
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isAwaitingResponse) return;

      let activeSessionId = sessionId;
      if (!activeSessionId) {
        const session = await createSessionMutation.mutateAsync();
        activeSessionId = session.id;
      }

      // Optimistic user message
      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: activeSessionId,
        role: "user",
        content: { type: "text", text: text.trim() },
        createdAt: new Date().toISOString(),
      };
      addMessage(optimisticMessage);
      setIsAwaitingResponse(true);

      try {
        const response = await chatService.sendMessage(
          activeSessionId,
          text.trim(),
        );
        addMessage(response);
      } catch (error) {
        // Add error message to chat
        const errMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sessionId: activeSessionId,
          role: "assistant",
          content: {
            type: "text",
            text:
              error instanceof Error
                ? `Error: ${error.message}`
                : "Something went wrong. Please try again.",
          },
          createdAt: new Date().toISOString(),
        };
        addMessage(errMessage);
      } finally {
        setIsAwaitingResponse(false);
      }
    },
    [
      sessionId,
      isAwaitingResponse,
      addMessage,
      setIsAwaitingResponse,
      createSessionMutation,
    ],
  );

  return {
    sessionId,
    messages,
    isAwaitingResponse,
    sendMessage,
    initSession,
    isCreatingSession: createSessionMutation.isPending,
  };
}
