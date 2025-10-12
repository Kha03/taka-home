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

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-gray-200";
    if (score === 1) return "bg-red-400";
    if (score === 2) return "bg-yellow-400";
    if (score === 3) return "bg-blue-400";
    return "bg-green-400";
  };

  return (
    <div className="space-y-2">
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

      <div className="h-1 w-full rounded bg-muted overflow-hidden">
        <div
          className={`h-1 rounded transition-all duration-300 ${getStrengthColor(
            score
          )}`}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}
