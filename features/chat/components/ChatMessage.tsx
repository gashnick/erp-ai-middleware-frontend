"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const text =
    typeof message.content === "string"
      ? message.content
      : (message.content?.text ?? "");

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isAssistant ? "flex-row" : "flex-row-reverse",
      )}
      role="article"
      aria-label={`${isAssistant ? "AI" : "You"}: ${text}`}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full mt-0.5",
          isAssistant
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700",
        )}
      >
        {isAssistant ? (
          <Bot className="h-3.5 w-3.5" />
        ) : (
          <User className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAssistant
            ? "rounded-tl-sm bg-gray-100 text-gray-800"
            : "rounded-tr-sm bg-blue-600 text-white",
        )}
      >
        {message.isStreaming ? (
          <span>
            {text}
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current opacity-70" />
          </span>
        ) : (
          text
        )}
        {/* Latency badge for AI messages */}
        {isAssistant && message.latencyMs && (
          <div className="mt-1 text-[10px] text-gray-400">
            {(message.latencyMs / 1000).toFixed(1)}s
          </div>
        )}
      </div>
    </div>
  );
}
