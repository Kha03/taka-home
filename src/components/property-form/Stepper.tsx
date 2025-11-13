"use client";

import React from "react";

export function Stepper({ step }: { step: 1 | 2 }) {
  const items = [
    { id: 1, label: "Nhập thông tin BĐS" },
    { id: 2, label: "Chờ xét duyệt" },
  ] as const;

  return (
    <div className="mx-auto mb-6 flex max-w-3xl items-center gap-3">
      {items.map((it, idx) => (
        <React.Fragment key={it.id}>
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold ${
                step === it.id ? "bg-accent text-primary" : "bg-background"
              }`}
            >
              {it.id}
            </div>
            <span className="text-sm text-primary">{it.label}</span>
          </div>
          {idx < items.length - 1 && <div className="h-px flex-1 bg-muted" />}
        </React.Fragment>
      ))}
    </div>
  );
}
