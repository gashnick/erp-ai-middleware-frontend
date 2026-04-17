"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChatSession } from "../hooks/useChatSession";
import { useChatScroll } from "../hooks/useChatScroll";

export function ChatWindow() {
  const { messages, isAwaitingResponse, sendMessage, initSession } =
    useChatSession();
  const { bottomRef, containerRef } = useChatScroll(messages);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
        </div>
        <span className="text-sm font-semibold text-gray-900">
          AI Assistant
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Online
        </span>
      </div>

      {/* Message list */}
      <div
        ref={containerRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {isEmpty ? (
          <EmptyState />
        ) : (
          messages.map((msg: (typeof messages)[number]) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {isAwaitingResponse && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3">
        <ChatInput onSend={sendMessage} isDisabled={isAwaitingResponse} />
        <p className="mt-1.5 text-center text-[10px] text-gray-400">
          AI may make mistakes. Always verify critical business data.
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50">
        <Sparkles className="h-6 w-6 text-purple-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">
          Ask about your business
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          Revenue trends, overdue invoices, staff headcount…
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100">
        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
