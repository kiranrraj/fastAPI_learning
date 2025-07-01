// src\app\components\tab\TabScroller.tsx

"use client";

import { ReactNode, useRef } from "react";
import styles from "./TabScroller.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// children: the tab elements to scroll horizontally
interface TabScrollerProps {
  children: ReactNode;
}

export default function TabScroller({ children }: TabScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={scrollLeft}
        className={styles.scrollButton}
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>

      <div className={styles.scrollContainer} ref={scrollRef}>
        {children}
      </div>

      <button
        onClick={scrollRight}
        className={styles.scrollButton}
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
