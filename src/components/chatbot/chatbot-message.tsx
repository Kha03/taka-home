"use client";

import React from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/utils";
import { Bot, User, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatbotMessageProps {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface PropertyRoom {
  title: string;
  details: string[];
  link: string;
}

export function ChatbotMessage({
  type,
  content,
  timestamp,
  isLoading,
}: ChatbotMessageProps) {
  const isBot = type === "bot";

  // Parse property rooms from markdown format
  const parsePropertyRooms = (text: string): PropertyRoom[] => {
    const rooms: PropertyRoom[] = [];

    // Check if content has property links
    const hasPropertyLinks = text.includes(
      "https://taka-home-ten.vercel.app/properties/"
    );
    if (!hasPropertyLinks) return rooms;

    // Split by double newline to get individual room blocks
    const blocks = text.split("\n\n").filter((block) => block.trim());

    for (const block of blocks) {
      // Skip if block doesn't contain essential info
      if (!block.includes("**Link:**")) continue;

      const lines = block.split("\n").map((l) => l.trim());
      let title = "";
      let link = "";
      const details: string[] = [];

      for (const line of lines) {
        // Extract title (e.g., "**1. Loại 2**")
        if (/^\*\*\d+\.\s+(.+?)\*\*$/.test(line)) {
          const match = line.match(/^\*\*\d+\.\s+(.+?)\*\*$/);
          if (match) title = match[1];
        }
        // Extract link
        else if (line.startsWith("**Link:**")) {
          const urlMatch = line.match(
            /https:\/\/taka-home-ten\.vercel\.app\/properties\/[^\s]+/
          );
          if (urlMatch) link = urlMatch[0];
        }
        // Extract other details (address, price, area, bedrooms, bathrooms)
        else if (line.startsWith("**") && line.includes(":**")) {
          const cleaned = line.replace(/\*\*/g, "");
          details.push(cleaned);
        }
      }

      if (title && link) {
        rooms.push({ title, details, link });
      }
    }

    return rooms;
  };

  const propertyRooms = isBot ? parsePropertyRooms(content) : [];

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[75%]",
          isBot ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm",
            isBot
              ? "bg-muted text-foreground rounded-tl-none"
              : "bg-primary text-primary-foreground rounded-tr-none"
          )}
        >
          {isLoading ? (
            <div className="flex gap-1 py-1">
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-current animate-bounce"></span>
            </div>
          ) : isBot && propertyRooms.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm mb-3">
                Tôi đã tìm thấy {propertyRooms.length} phòng phù hợp với yêu cầu
                của bạn:
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {propertyRooms.map((room, index) => (
                  <div
                    key={index}
                    className="bg-background/50 dark:bg-background/30 border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
                  >
                    <h4 className="font-semibold text-sm mb-2 text-foreground">
                      {index + 1}. {room.title}
                    </h4>
                    <div className="text-xs text-muted-foreground space-y-1 mb-2">
                      {room.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>
                    <Link
                      href={
                        room.link.replace(
                          "https://taka-home-ten.vercel.app",
                          ""
                        ) || "/"
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Xem chi tiết
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : isBot ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  p: ({ children }: { children?: React.ReactNode }) => (
                    <p className="mb-1.5 last:mb-0 text-sm leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }: { children?: React.ReactNode }) => (
                    <ul className="list-disc list-inside mb-1.5 space-y-0.5 text-sm">
                      {children}
                    </ul>
                  ),
                  li: ({ children }: { children?: React.ReactNode }) => (
                    <li className="ml-1 text-sm">{children}</li>
                  ),
                  strong: ({ children }: { children?: React.ReactNode }) => (
                    <strong className="font-semibold text-sm">
                      {children}
                    </strong>
                  ),
                  a: ({
                    href,
                    children,
                  }: {
                    href?: string;
                    children?: React.ReactNode;
                  }) => {
                    if (!href) return <span>{children}</span>;

                    // Check if it's an internal link (starts with / or localhost or vercel domain)
                    const isInternal =
                      href.startsWith("/") ||
                      href.includes("localhost") ||
                      href.includes("taka-home-ten.vercel.app");

                    if (isInternal) {
                      // Extract path after domain or use as is
                      let path = href;
                      if (href.includes("localhost")) {
                        path = href.split(/localhost:\d+/).pop() || "/";
                      } else if (href.includes("taka-home-ten.vercel.app")) {
                        path =
                          href.replace(
                            "https://taka-home-ten.vercel.app",
                            ""
                          ) || "/";
                      }

                      return (
                        <Link
                          href={path}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm not-prose cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {children}
                        </Link>
                      );
                    }

                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm not-prose cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          )}
        </div>
        <span className="text-sm text-muted-foreground mt-1 px-1">
          {timestamp.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User className="w-5 h-5 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}
