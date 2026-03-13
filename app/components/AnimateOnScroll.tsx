"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-in";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = "",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`scroll-animate ${className}`}
      data-animation={animation}
      style={{
        "--scroll-delay": `${delay}ms`,
        "--scroll-duration": `${duration}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
