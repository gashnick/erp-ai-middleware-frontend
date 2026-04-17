import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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

  const createSessionMutation = useMutation({
    mutationFn: chatService.createSession,
    onSuccess: (session) => {
      setSessionId(session.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: chatService.sendMessage,
    onMutate: ({ content }) => {
      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      };
      addMessage(optimisticMessage);
      setIsAwaitingResponse(true);
    },
    onSuccess: ({ message }) => {
      addMessage(message);
      setIsAwaitingResponse(false);
    },
    onError: () => {
      setIsAwaitingResponse(false);
    },
  });

  const initSession = useCallback(async () => {
    if (!sessionId) {
      await createSessionMutation.mutateAsync();
    }
  }, [sessionId, createSessionMutation]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isAwaitingResponse) return;

      const activeSessionId =
        sessionId ?? (await createSessionMutation.mutateAsync()).id;

      await sendMessageMutation.mutateAsync({
        sessionId: activeSessionId,
        content: content.trim(),
      });
    },
    [sessionId, isAwaitingResponse, sendMessageMutation, createSessionMutation],
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
