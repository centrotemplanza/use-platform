import { supabase } from "@/lib/supabase";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const resolved = await params;
  const username = resolved.username.toLowerCase();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return <main className="p-6 text-red-600">{error.message}</main>;
  }

  if (!profile) {
    return <main className="p-6">This profile could not be found.</main>;
  }

  if (!profile.is_public) {
    return <main className="p-6">This profile is private.</main>;
  }

  const fullName = [
    profile.first_name,
    profile.middle_name,
    profile.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">
        {fullName || profile.username || "Public Profile"}
      </h1>

      <div className="mt-4 text-sm space-y-2">
        <p>
          <strong>Username:</strong> {profile.username || "—"}
        </p>
        <p>
          <strong>Level:</strong> {profile.user_level || "—"}
        </p>
        <p>
          <strong>Bio:</strong> {profile.bio || "—"}
        </p>
        <p>
          <strong>Country:</strong> {profile.country_of_residence || "—"}
        </p>
        <p>
          <strong>Website:</strong>{" "}
          {profile.website ? (
            <a
              className="underline"
              href={profile.website}
              target="_blank"
              rel="noreferrer"
            >
              {profile.website}
            </a>
          ) : (
            "—"
          )}
        </p>
      </div>
    </main>
  );
}