"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { normalizeUsername, validateUsername } from "@/lib/username";

type UsernameState =
  | { status: "idle"; message: string }
  | { status: "checking"; message: string }
  | { status: "invalid"; message: string }
  | { status: "taken"; message: string }
  | { status: "available"; message: string }
  | { status: "error"; message: string };

export default function SignupPage() {
  const [usernameInput, setUsernameInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameState, setUsernameState] = useState<UsernameState>({
    status: "idle",
    message: "Choose your public username.",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const normalizedUsername = useMemo(
    () => normalizeUsername(usernameInput),
    [usernameInput]
  );

  useEffect(() => {
    if (!usernameInput.trim()) {
      setUsernameState({
        status: "idle",
        message: "Choose your public username.",
      });
      return;
    }

    const validation = validateUsername(usernameInput);

    if (!validation.isValid) {
      setUsernameState({
        status: "invalid",
        message: validation.message,
      });
      return;
    }

    setUsernameState({
      status: "checking",
      message: "Checking availability...",
    });

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/username/check?username=${encodeURIComponent(usernameInput)}`
        );

        const result = await response.json();

        if (!response.ok) {
          setUsernameState({
            status: "error",
            message: result.message || "Could not verify username.",
          });
          return;
        }

        if (result.available) {
          setUsernameState({
            status: "available",
            message: `@${result.normalized} is available.`,
          });
          return;
        }

        setUsernameState({
          status: result.code === "taken" ? "taken" : "invalid",
          message: result.message || "This username is not available.",
        });
      } catch {
        setUsernameState({
          status: "error",
          message: "Could not verify username right now.",
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [usernameInput]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    const validation = validateUsername(usernameInput);

    if (!validation.isValid) {
      setUsernameState({
        status: "invalid",
        message: validation.message,
      });
      return;
    }

    if (usernameState.status !== "available") {
      setFormMessage("Please choose an available username.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: validation.normalized,
          },
        },
      });

      if (error) {
        setFormMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      setFormMessage(
        "Account created successfully. Check your email to verify your account."
      );
      setUsernameInput("");
      setEmail("");
      setPassword("");
      setUsernameState({
        status: "idle",
        message: "Choose your public username.",
      });
    } catch {
      setFormMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function getUsernameMessageClass() {
    switch (usernameState.status) {
      case "available":
        return "text-green-600";
      case "invalid":
      case "taken":
      case "error":
        return "text-red-600";
      case "checking":
        return "text-zinc-500";
      default:
        return "text-zinc-500";
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
          Create account
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
          Sign up
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Create your account and reserve your public username.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-900"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              autoComplete="username"
              value={usernameInput}
              onChange={(event) => setUsernameInput(event.target.value)}
              placeholder="cristobalcordova"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900"
            />

            <p className="mt-2 text-xs text-zinc-500">
              Your public profile will look like:
              <span className="font-medium text-zinc-900">
                {" "}
                /{normalizedUsername || "yourusername"}
              </span>
            </p>

            <p className={`mt-2 text-sm ${getUsernameMessageClass()}`}>
              {usernameState.message}
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-900"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-900"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900"
              required
            />
          </div>

          {formMessage ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700">
              {formMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || usernameState.status !== "available"}
            className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

