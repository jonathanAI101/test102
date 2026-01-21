"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: number;
  title: string;
  updatedAt: string;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId?: number;
  onNewChat: () => void;
  onSelectConversation: (id: number) => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
}: SidebarProps) {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="h-10 w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          New Chat
        </Button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          History
        </h3>
        <div className="flex flex-col gap-1">
          {conversations.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
              No conversations yet
            </p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  activeConversationId === conversation.id
                    ? "bg-slate-200 dark:bg-slate-800"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 text-slate-400"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                    {conversation.title}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              User
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
