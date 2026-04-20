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

  const isInitializingRef = useRef(false); // ← prevents concurrent calls

  const createSessionMutation = useMutation({
    mutationFn: chatService.createSession,
    onSuccess: (session) => {
      setSessionId(session.id);
    },
  });

  const initSession = useCallback(async () => {
    // Guard: don't create a session if one exists or one is being created
    if (sessionId || isInitializingRef.current) return;

    isInitializingRef.current = true;
    try {
      await createSessionMutation.mutateAsync();
    } finally {
      isInitializingRef.current = false;
    }
  }, [sessionId]); // ← only depends on sessionId, not createSessionMutation

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isAwaitingResponse) return;

      let activeSessionId = sessionId;
      if (!activeSessionId) {
        const session = await createSessionMutation.mutateAsync();
        activeSessionId = session.id;
      }

      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      };
      addMessage(optimisticMessage);
      setIsAwaitingResponse(true);

      try {
        const response = await chatService.sendMessage({
          sessionId: activeSessionId,
          content: content.trim(),
        });
        addMessage(response.message);
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
