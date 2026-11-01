"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function MotionArt({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.article
      className={className}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      whileHover={{ y: -6, borderColor: "rgba(194, 239, 121, 0.42)" }}
      whileTap={{ scale: 0.994 }}
    >
      {children}
    </motion.article>
  );
}

export function MotionAnchor({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <motion.a
      className={className}
      href={href}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}
