"use client";

import React from "react";

export function DottedBox({
  children,
  className = "",
  onClick,
}: React.PropsWithChildren<{
  className?: string;
  onClick?: () => void;
}>) {
  return (
    <div
      className={`rounded-xl border-2 border-dotted p-4 ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
