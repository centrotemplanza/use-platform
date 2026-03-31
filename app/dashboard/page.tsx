"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Profile = {
  id: string;
  email: string | null;
  user_level: string;
  instructor_application_status: string;
  username: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  bio: string | null;
  is_public: boolean;
};

function getDisplayName(profile: Profile | null) {
  if (!profile) return "—";
  const fullName = [
    profile.first_name,
    profile.middle_name,
    profile.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "—";
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile() {
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("No authenticated user");
      setLoading(false);
      return;
    }

    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!data && user.email) {
      const { data: existingByEmail } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (existingByEmail) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ id: user.id })
          .eq("email", user.email);

        if (updateError) {
          console.error("FIX EMAIL DUPLICATE ERROR:", updateError);
          setError(updateError.message);
          setLoading(false);
          return;
        }

        data = existingByEmail;
      }
    }

    if (!data) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        user_level: "base",
        is_public: true,
        instructor_application_status: "none",
      });

      if (insertError) {
        console.error("CREATE PROFILE ERROR:", insertError);
        setError(insertError.message);
        setLoading(false);
        return;
      }

      const { data: newData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      data = newData;
    }

    setProfile(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return <main className="p-6">Loading...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  return (
    <main className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="mt-4 text-sm">
        <p>
          <strong>Signed in as:</strong> {profile?.email}
        </p>
      </div>

      <div className="mt-6 border p-4 rounded">
        <h2 className="font-semibold">Your profile</h2>

        <div className="mt-2 text-sm space-y-1">
          <p>
            <strong>Name:</strong> {getDisplayName(profile)}
          </p>
          <p>
            <strong>Username:</strong> {profile?.username || "—"}
          </p>
          <p>
            <strong>Public URL:</strong>{" "}
            {profile?.username ? `/${profile.username}` : "Set your username in Edit Profile"}
          </p>
          <p>
            <strong>Level:</strong> {profile?.user_level}
          </p>
          <p>
            <strong>Instructor status:</strong>{" "}
            {profile?.instructor_application_status}
          </p>
          <p>
            <strong>Bio:</strong> {profile?.bio || "—"}
          </p>
          <p>
            <strong>Public:</strong> {profile?.is_public ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Link className="underline" href="/profile">
          Edit my profile
        </Link>

        {profile?.username ? (
          <Link className="underline" href={`/${profile.username}`}>
            View my public page
          </Link>
        ) : null}

        <Link className="underline" href="/courses">
          View courses
        </Link>

        <Link className="underline" href="/my-courses">
          My courses
        </Link>

        <Link className="underline" href="/my-certificates">
          My certificates
        </Link>

        <button
          onClick={signOut}
          className="border rounded px-3 py-2 mt-2"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}

