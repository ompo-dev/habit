"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Color {
  name: string;
  value: string;
  background?: string;
}

interface ColorPickerProps {
  colors: Color[];
  selectedColor: string | { primary: string; background: string };
  onSelect: (color: string | { primary: string; background: string }) => void;
  className?: string;
  showNames?: boolean;
}

export function ColorPicker({
  colors,
  selectedColor,
  onSelect,
  className,
  showNames = true,
}: ColorPickerProps) {
  const isSelected = (colorValue: string) => {
    if (typeof selectedColor === "string") {
      return selectedColor === colorValue;
    }
    return selectedColor.primary === colorValue;
  };

  return (
    <div
      className={cn(
        "grid grid-cols-4 sm:grid-cols-6 gap-3",
        className
      )}
    >
      {colors.map((color) => {
        const colorValue = typeof color.value === "string" ? color.value : color.value;
        const selected = isSelected(colorValue);

        return (
          <button
            key={color.name}
            onClick={() => {
              if (color.background) {
                onSelect({ primary: colorValue, background: color.background });
              } else {
                onSelect(colorValue);
              }
            }}
            className={cn(
              "relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all backdrop-blur-xl border",
              selected
                ? "bg-white/20 ring-2 ring-white/50 border-white/30"
                : "bg-white/5 hover:bg-white/10 border-white/10"
            )}
          >
            <div
              className="h-10 w-10 rounded-lg shadow-lg"
              style={{ backgroundColor: colorValue }}
            />
            {showNames && (
              <span className="text-xs text-white/80">{color.name}</span>
            )}
            {selected && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-lg">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

