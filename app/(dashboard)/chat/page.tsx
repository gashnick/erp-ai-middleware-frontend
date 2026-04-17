import { ChatWindow } from "@/features/chat/components/ChatWindow";

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
        <p className="text-sm text-gray-500">
          Ask questions about your business data in plain English
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
