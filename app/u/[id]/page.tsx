import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  user_level: string | null;
  is_public: boolean | null;
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url, user_level, is_public")
    .eq("id", id)
    .single<Profile>();

  if (error || !data) {
    return (
      <main className="p-6 max-w-md">
        <h1 className="text-xl font-semibold">User</h1>
        <p className="mt-2 text-sm text-red-600">
          {error?.message ?? "Profile not found."}
        </p>
      </main>
    );
  }

  if (!data.is_public) {
    return (
      <main className="p-6 max-w-md">
        <h1 className="text-xl font-semibold">
          {data.full_name ?? "User profile"}
        </h1>
        <p className="mt-4 text-sm">This profile is private.</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-md">
      <h1 className="text-xl font-semibold">
        {data.full_name ?? "User profile"}
      </h1>
      {data.user_level ? (
        <p className="mt-2 text-sm opacity-80">
          user_level: <span className="font-mono">{data.user_level}</span>
        </p>
      ) : null}

      {data.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mt-4 w-24 h-24 rounded border object-cover"
          src={data.avatar_url}
          alt=""
        />
      ) : null}

      {data.bio ? (
        <p className="mt-4 text-sm whitespace-pre-wrap">{data.bio}</p>
      ) : (
        <p className="mt-4 text-sm opacity-70">No bio.</p>
      )}
    </main>
  );
}

