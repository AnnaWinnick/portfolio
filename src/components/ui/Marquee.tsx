"use client";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({
  children,
  className = "",
  speed = "normal",
}: MarqueeProps) {
  const speedClass = {
    slow: "[--marquee-duration:30s]",
    normal: "[--marquee-duration:20s]",
    fast: "[--marquee-duration:10s]",
  }[speed];

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${speedClass} ${className}`}
    >
      <div
        className="inline-flex animate-marquee"
        style={{ animationDuration: "var(--marquee-duration)" }}
      >
        <span className="px-4">{children}</span>
        <span className="px-4" aria-hidden="true">
          {children}
        </span>
        <span className="px-4" aria-hidden="true">
          {children}
        </span>
        <span className="px-4" aria-hidden="true">
          {children}
        </span>
      </div>
    </div>
  );
}
