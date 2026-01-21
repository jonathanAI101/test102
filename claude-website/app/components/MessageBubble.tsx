"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-xs rounded-2xl px-4 py-3 text-sm md:max-w-md md:text-base lg:max-w-xl lg:text-lg",
          isUser
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
        )}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600">
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Claude
            </span>
          </div>
        )}

        {/* Message content */}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {/* Timestamp */}
        <p
          className={cn(
            "mt-2 text-xs",
            isUser
              ? "text-slate-300 dark:text-slate-600"
              : "text-slate-400 dark:text-slate-500"
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}
