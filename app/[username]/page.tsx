type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
        Public profile
      </p>

      <h1 className="mt-4 text-3xl font-semibold text-zinc-950">
        @{username}
      </h1>

      <p className="mt-4 text-base leading-7 text-zinc-600">
        This public profile page is being prepared.
      </p>
    </div>
  );
}