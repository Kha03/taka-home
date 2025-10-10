"use client";

import React from "react";

export function DottedBox({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-xl border-2 border-dotted p-4 ${className}`}>
      {children}
    </div>
  );
}
