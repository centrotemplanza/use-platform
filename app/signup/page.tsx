"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error("AUTH SIGNUP ERROR:", signUpError);
        throw signUpError;
      }

      const user = data.user;

      if (!user?.id) {
        throw new Error("User created but no ID returned");
      }

      // 2. Crear perfil con NUEVO MODELO
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        user_level: "base",
        is_public: true,
        instructor_application_status: "none",
      });

      if (profileError) {
        console.error("PROFILE INSERT ERROR:", profileError);
        throw profileError;
      }

      // 3. Redirección
      if (data.session) {
        router.replace("/dashboard");
        return;
      }

      setMessage(
        "Cuenta creada. Revisa tu email si tienes confirmación activada."
      );
      router.replace("/login");
    } catch (err: unknown) {
      console.error("SIGNUP FLOW ERROR:", err);

      if (err && typeof err === "object" && "message" in err) {
        setError(String((err as { message: unknown }).message));
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-md">
      <h1 className="text-xl font-semibold">Sign up</h1>

      <form className="mt-6 flex flex-col gap-3" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Email</span>
          <input
            className="border rounded px-3 py-2"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Password</span>
          <input
            className="border rounded px-3 py-2"
            autoComplete="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className="border rounded px-3 py-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm">{message}</p> : null}
      </form>
    </main>
  );
}

