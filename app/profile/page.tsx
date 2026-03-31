"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string | null;
  user_level: string;
  instructor_application_status: string;
  username: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  phone: string | null;
  country_of_residence: string | null;
  website: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
};

const RESERVED_USERNAMES = new Set([
  "login",
  "signup",
  "dashboard",
  "courses",
  "profile",
  "my-courses",
  "my-certificates",
  "api",
  "admin",
  "settings",
  "about",
  "contact",
]);

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const normalizedUsername = useMemo(
    () => username.trim().toLowerCase(),
    [username]
  );

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("GET USER ERROR:", userError);
        setError("No authenticated user found.");
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("LOAD PROFILE ERROR:", profileError);
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(data);
      setUsername(data.username ?? "");
      setFirstName(data.first_name ?? "");
      setMiddleName(data.middle_name ?? "");
      setLastName(data.last_name ?? "");
      setDateOfBirth(data.date_of_birth ?? "");
      setPhone(data.phone ?? "");
      setCountryOfResidence(data.country_of_residence ?? "");
      setWebsite(data.website ?? "");
      setBio(data.bio ?? "");
      setAvatarUrl(data.avatar_url ?? "");
      setIsPublic(data.is_public ?? true);

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("GET USER ERROR:", userError);
      setError("No authenticated user found.");
      setSaving(false);
      return;
    }

    if (!firstName.trim()) {
      setError("First name is required.");
      setSaving(false);
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      setSaving(false);
      return;
    }

    if (!countryOfResidence.trim()) {
      setError("Country of residence is required.");
      setSaving(false);
      return;
    }

    if (normalizedUsername) {
      if (RESERVED_USERNAMES.has(normalizedUsername)) {
        setError("That username is reserved. Please choose another one.");
        setSaving(false);
        return;
      }

      if (!/^[a-z0-9_-]{3,30}$/.test(normalizedUsername)) {
        setError(
          "Username must be 3 to 30 characters and use only lowercase letters, numbers, underscores, or hyphens."
        );
        setSaving(false);
        return;
      }

      const { data: existingUsername, error: usernameCheckError } =
        await supabase
          .from("profiles")
          .select("id, username")
          .eq("username", normalizedUsername)
          .maybeSingle();

      if (usernameCheckError) {
        console.error("USERNAME CHECK ERROR:", usernameCheckError);
        setError(usernameCheckError.message);
        setSaving(false);
        return;
      }

      if (existingUsername && existingUsername.id !== user.id) {
        setError("That username is already taken.");
        setSaving(false);
        return;
      }
    }

    const cleanWebsite = website.trim();
    const normalizedWebsite =
      cleanWebsite && !cleanWebsite.startsWith("http://") && !cleanWebsite.startsWith("https://")
        ? `https://${cleanWebsite}`
        : cleanWebsite;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: normalizedUsername || null,
        first_name: firstName.trim(),
        middle_name: middleName.trim() || null,
        last_name: lastName.trim(),
        date_of_birth: dateOfBirth || null,
        phone: phone.trim() || null,
        country_of_residence: countryOfResidence.trim(),
        website: normalizedWebsite || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        is_public: isPublic,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("SAVE PROFILE ERROR:", updateError);
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setMessage("Profile saved successfully.");
    setSaving(false);
  }

  if (loading) {
    return <main className="p-6">Loading profile...</main>;
  }

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold">Edit Profile</h1>

      {profile ? (
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <p>Email: {profile.email}</p>
          <p>Level: {profile.user_level}</p>
          <p>Instructor status: {profile.instructor_application_status}</p>
        </div>
      ) : null}

      <form className="mt-6 flex flex-col gap-3" onSubmit={onSave}>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Username</span>
          <input
            className="border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="yourpublicname"
          />
          <span className="text-xs text-gray-500">
            Public URL: {normalizedUsername ? `/${normalizedUsername}` : "/yourusername"}
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">First name</span>
          <input
            className="border rounded px-3 py-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Second name</span>
          <input
            className="border rounded px-3 py-2"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Second name"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Last name</span>
          <input
            className="border rounded px-3 py-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Date of birth</span>
          <input
            className="border rounded px-3 py-2"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Phone</span>
          <input
            className="border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Country of residence</span>
          <input
            className="border rounded px-3 py-2"
            value={countryOfResidence}
            onChange={(e) => setCountryOfResidence(e.target.value)}
            placeholder="Country"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Website</span>
          <input
            className="border rounded px-3 py-2"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Bio</span>
          <textarea
            className="border rounded px-3 py-2 min-h-28"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Avatar URL</span>
          <input
            className="border rounded px-3 py-2"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span className="text-sm">Public profile</span>
        </label>

        <button
          className="border rounded px-3 py-2"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-600">{message}</p> : null}
      </form>
    </main>
  );
}