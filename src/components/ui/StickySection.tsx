"use client";

import { ReactNode } from "react";
import { useStickyStack } from "@/hooks/useStickyStack";

interface StickySectionProps {
  children: ReactNode;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}

export function StickySection({
  children,
  index,
  className = "",
  style,
}: StickySectionProps) {
  const ref = useStickyStack<HTMLDivElement>(index);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
