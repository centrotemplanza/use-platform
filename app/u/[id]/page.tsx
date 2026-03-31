type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-zinc-500">User</p>

      <h1 className="text-2xl font-semibold text-zinc-900">
        User ID: {id}
      </h1>

      <p className="mt-4 text-zinc-600">
        This user page will be implemented soon.
      </p>
    </div>
  );
}

