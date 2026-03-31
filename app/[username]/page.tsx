import { notFound } from "next/navigation";
import { RESERVED_USERNAMES } from "@/config/reserved-usernames";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: {
    username: string;
  };
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function PublicProfilePage({ params }: PageProps) {
  const username = params.username.toLowerCase();

  // 🚫 bloquear palabras reservadas
  if (RESERVED_USERNAMES.has(username)) {
    return notFound();
  }

  // 🔎 buscar usuario por username
  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !user) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        {user.username}
      </h1>

      <p className="mt-4 text-zinc-600">
        {user.bio || "No bio yet"}
      </p>
    </div>
  );
}