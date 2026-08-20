"use client";

import { useActionState } from "react";
import {
  loginAction,
  registerAction,
  type AuthFormState,
} from "@/app/actions/auth";

const initial: AuthFormState = {};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  // Separate hooks + key on the page remount so login never reuses register state/action.
  if (mode === "register") {
    return <RegisterForm />;
  }
  return <LoginForm />;
}

function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <EmailField />
      <PasswordField autoComplete="current-password" />
      <ErrorMessage error={state.error} />
      <SubmitButton pending={pending} label="Sign in" />
    </form>
  );
}

function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="label-caps text-[var(--color-on-surface-variant)]">Name</span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Alex"
          className="rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-fill)] px-4 py-3 text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]/60"
        />
      </label>
      <EmailField />
      <PasswordField autoComplete="new-password" />
      <ErrorMessage error={state.error} />
      {state.message && (
        <p
          className="rounded-[var(--radius-sm)] bg-[var(--accent-sage-soft)] px-3 py-2 text-sm text-[var(--color-primary)]"
          role="status"
        >
          {state.message}
        </p>
      )}
      <SubmitButton pending={pending} label="Create account" />
    </form>
  );
}

function EmailField() {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-[var(--color-on-surface-variant)]">Email</span>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-fill)] px-4 py-3 text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]/60"
      />
    </label>
  );
}

function PasswordField({ autoComplete }: { autoComplete: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-[var(--color-on-surface-variant)]">Password</span>
      <input
        name="password"
        type="password"
        required
        minLength={6}
        autoComplete={autoComplete}
        placeholder="••••••••"
        className="rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-fill)] px-4 py-3 text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)]/60"
      />
    </label>
  );
}

function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p
      className="rounded-[var(--radius-sm)] bg-red-500/10 px-3 py-2 text-sm text-red-200"
      role="alert"
    >
      {error}
    </p>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-full bg-[var(--color-secondary)] px-6 py-3 text-sm font-medium tracking-wide text-[var(--color-on-secondary)] shadow-[0_0_24px_var(--glow-teal)] transition-opacity hover:opacity-95 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}
