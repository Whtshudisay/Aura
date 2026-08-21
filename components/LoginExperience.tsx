"use client";

import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/AuthForm";

const phrases = [
  "Breathe in calm",
  "Stress less",
  "Sleep deeper",
  "Find your rhythm",
  "Return to center",
];

export function LoginExperience({ mode }: { mode: "login" | "register" }) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reduceMotion) return;
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [mounted, reduceMotion]);

  const ease = [0.22, 1, 0.36, 1] as const;
  const animate = mounted && !reduceMotion;

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {animate ? (
          <>
            <motion.div
              className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--color-primary)]/15 blur-3xl"
              animate={{ x: [0, 40, -10, 0], y: [0, 30, -20, 0], scale: [1, 1.12, 0.96, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-20 bottom-24 h-80 w-80 rounded-full bg-[var(--color-secondary)]/12 blur-3xl"
              animate={{ x: [0, -35, 15, 0], y: [0, -25, 20, 0], scale: [1, 0.94, 1.1, 1] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--color-tertiary)]/8 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            {[
              { top: "18%", left: "12%", size: 8, delay: 0 },
              { top: "28%", right: "18%", size: 6, delay: 1.2 },
              { top: "72%", left: "22%", size: 10, delay: 0.6 },
              { top: "64%", right: "14%", size: 7, delay: 2 },
            ].map((dot, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-[var(--color-primary)]/40"
                style={{
                  top: dot.top,
                  left: "left" in dot ? dot.left : undefined,
                  right: "right" in dot ? dot.right : undefined,
                  width: dot.size,
                  height: dot.size,
                }}
                animate={{ y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: dot.delay,
                }}
              />
            ))}
          </>
        ) : (
          <>
            <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--color-primary)]/15 blur-3xl" />
            <div className="absolute -right-20 bottom-24 h-80 w-80 rounded-full bg-[var(--color-secondary)]/12 blur-3xl" />
          </>
        )}
      </div>

      <div className="relative z-10 mb-10 flex w-full max-w-md flex-col items-center text-center">
        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease }}
          className="mb-5 sm:mb-6"
        >
          <motion.span
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-sage-soft)] ring-1 ring-[var(--glass-border)] sm:h-24 sm:w-24 md:h-28 md:w-28"
            aria-hidden
            animate={
              animate
                ? {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 0 0 rgba(172,206,197,0)",
                      "0 0 36px rgba(172,206,197,0.35)",
                      "0 0 0 rgba(172,206,197,0)",
                    ],
                  }
                : undefined
            }
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {animate && (
              <>
                <motion.span
                  className="absolute inset-0 rounded-full border border-[var(--color-primary)]/25"
                  animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute inset-0 rounded-full border border-[var(--color-primary)]/20"
                  animate={{ scale: [1, 1.55], opacity: [0.4, 0] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.9,
                  }}
                />
              </>
            )}
            <svg
              viewBox="0 0 24 24"
              className="relative h-10 w-10 text-[var(--color-primary)] sm:h-12 sm:w-12 md:h-14 md:w-14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="12" cy="12" r="7" opacity="0.55" />
              <circle cx="12" cy="12" r="10.5" opacity="0.28" />
            </svg>
          </motion.span>
        </motion.div>

        <p className="label-caps text-sm tracking-[0.22em] text-[var(--color-on-surface)] sm:text-base">
          Aura
        </p>

        <div className="mt-4 flex h-9 items-center justify-center sm:h-10">
          {animate ? (
            <AnimatePresence mode="wait">
              <motion.p
                key={phrases[phraseIndex]}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
                className="text-lg font-light tracking-wide text-[var(--color-primary)] sm:text-xl"
              >
                {phrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          ) : (
            <p className="text-lg font-light tracking-wide text-[var(--color-primary)] sm:text-xl">
              {phrases[0]}
            </p>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-light text-[var(--color-on-surface)] sm:text-3xl">
          {mode === "login" ? "Welcome back" : "Begin your practice"}
        </h1>

        <p className="mt-2 max-w-sm text-sm text-[var(--color-on-surface-variant)]">
          {mode === "login"
            ? "Sign in to sync your weekly progress and streak."
            : "Create an account so your sessions stay with you."}
        </p>
      </div>

      <div className="glass relative z-10 w-full max-w-md rounded-[var(--radius-lg)] p-6 sm:p-8">
        <AuthForm key={mode} mode={mode} />

        <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link
                href="/login?mode=register"
                className="text-[var(--color-primary)] hover:underline"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--color-primary)] hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>

        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-[var(--color-on-surface-variant)] underline-offset-4 hover:text-[var(--color-on-surface)] hover:underline"
          >
            Continue as guest →
          </Link>
        </p>
      </div>
    </div>
  );
}
