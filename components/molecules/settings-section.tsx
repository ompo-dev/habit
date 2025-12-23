"use client";

import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <div
      className={`rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)] ${className || ""}`}
    >
      <h2 className="font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

