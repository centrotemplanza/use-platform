"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { normalizeUsername } from "@/lib/username";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type UsernameState = {
  status: "idle" | "checking" | "available" | "taken" | "invalid" | "error";
  message: string;
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const [usernameState, setUsernameState] = useState<UsernameState>({
    status: "idle",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // 🔍 Validación en vivo del username
  useEffect(() => {
    const username = normalizeUsername(usernameInput);

    if (!username) {
      setUsernameState({ status: "idle", message: "" });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setUsernameState({ status: "checking", message: "Checking..." });

        const res = await fetch(
          `/api/username/check?username=${encodeURIComponent(username)}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Error checking username");
        }

        if (data.available) {
          setUsernameState({
            status: "available",
            message: "Username available",
          });
        } else {
          setUsernameState({
            status: data.code === "taken" ? "taken" : "invalid",
            message: data.message,
          });
        }
      } catch (error) {
        setUsernameState({
          status: "error",
          message: "Could not verify username right now.",
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [usernameInput]);

  // 🚀 Crear cuenta
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormMessage("");

    if (usernameState.status !== "available") {
      setFormMessage("Please choose a valid username.");
      return;
    }

    setIsSubmitting(true);

    try {
      const username = normalizeUsername(usernameInput);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      setFormMessage("Account created. Check your email.");
    } catch (error: any) {
      setFormMessage(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-16 px-6">
      <h1 className="text-2xl font-semibold mb-6">Sign up</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* USERNAME */}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="yourname"
          />
          <p className="text-xs mt-1 text-zinc-500">
            Your profile will look like: /{normalizeUsername(usernameInput)}
          </p>

          {usernameState.message && (
            <p
              className={`text-sm mt-1 ${
                usernameState.status === "available"
                  ? "text-green-600"
                  : usernameState.status === "checking"
                  ? "text-zinc-500"
                  : "text-red-600"
              }`}
            >
              {usernameState.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={
            isSubmitting || usernameState.status !== "available"
          }
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        {/* MENSAJE */}
        {formMessage && (
          <p className="text-sm mt-2 text-center">{formMessage}</p>
        )}
      </form>
    </div>
  );
}