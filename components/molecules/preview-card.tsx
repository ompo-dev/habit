"use client";

import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PreviewCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  color: string | { primary: string; background: string };
  className?: string;
}

export function PreviewCard({
  icon,
  title,
  subtitle,
  color,
  className,
}: PreviewCardProps) {
  const IconComponent = (LucideIcons as any)[icon] as LucideIcon;
  const primaryColor = typeof color === "string" ? color : color.primary;
  const backgroundColor =
    typeof color === "string" ? color + "30" : color.background;

  return (
    <div
      className={`mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg ${className || ""}`}
    >
      <p className="text-sm text-white/60 mb-3">Preview</p>
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-xl border shadow-lg"
          style={{
            backgroundColor,
            borderColor: primaryColor + "50",
          }}
        >
          {IconComponent && (
            <IconComponent
              className="h-8 w-8"
              style={{ color: primaryColor }}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">
            {title || "Nome do hábito"}
          </h3>
          {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

