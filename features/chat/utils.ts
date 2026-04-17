import type { ChatMessage } from "./types";

export function groupMessagesByDate(
  messages: ChatMessage[],
): { date: string; messages: ChatMessage[] }[] {
  const groups = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    const key = new Date(msg.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const existing = groups.get(key) ?? [];
    groups.set(key, [...existing, msg]);
  }
  return Array.from(groups.entries()).map(([date, messages]) => ({
    date,
    messages,
  }));
}

export function isUserMessage(message: ChatMessage): boolean {
  return message.role === "user";
}

export function truncateSessionTitle(content: string, maxLength = 40): string {
  const cleaned = content.trim().replace(/\s+/g, " ");
  return cleaned.length > maxLength
    ? `${cleaned.slice(0, maxLength)}…`
    : cleaned;
}
