import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types";

export function useChatScroll(messages: ChatMessage[]) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return { bottomRef, containerRef };
}
