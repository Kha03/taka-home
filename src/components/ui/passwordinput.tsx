import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Nhập mật khẩu",
  required,
}: {
  id: string;
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = React.useState(false);

  const score = React.useMemo(() => {
    // naive strength score: 0-4
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Z]/.test(value)) s++;
    if (/[a-z]/.test(value)) s++;
    if (/[0-9]|[^A-Za-z0-9]/.test(value)) s++;
    return s;
  }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between">
        {value ? (
          <span className="text-xs text-muted-foreground">
            Độ mạnh: {score}/4
          </span>
        ) : null}
      </div>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-primary/10"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {/* Strength bar */}
      <div className="h-1 w-full rounded bg-muted">
        <div
          className={`h-1 rounded transition-all`}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}
