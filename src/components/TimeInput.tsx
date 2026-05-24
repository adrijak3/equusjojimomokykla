import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  id?: string;
  ariaLabel?: string;
}

/**
 * Time input that auto-formats HH:MM as the user types.
 * Typing "1730" -> displays "17:30". Backspace removes a digit at a time.
 */
export function TimeInput({ value, onChange, placeholder = "pvz. 17:30", className, autoFocus, id, ariaLabel }: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const format = (raw: string): string => {
    // Keep only digits
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = format(e.target.value);
    setLocal(formatted);
    onChange(formatted);
  };

  return (
    <Input
      id={id}
      aria-label={ariaLabel}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      value={local}
      onChange={handleChange}
      autoFocus={autoFocus}
      className={cn("tabular-nums", className)}
      maxLength={5}
    />
  );
}
