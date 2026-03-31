import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params;

  const response = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  const course = response.data;

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-zinc-950">
          Course not found
        </h1>

        <p className="mt-3 text-zinc-600">
          The requested course does not exist or is no longer available.
        </p>

        <div className="mt-6">
          <Link
            href="/courses"
            className="inline-flex rounded-lg bg-black px-5 py-2 text-white"
          >
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
        Course detail
      </p>

      <h1 className="mt-4 text-3xl font-semibold text-zinc-950">
        {course.title}
      </h1>

      <p className="mt-4 text-base leading-7 text-zinc-600">
        {course.description}
      </p>

      <div className="mt-6">
        <span className="rounded bg-zinc-200 px-3 py-1 text-sm text-zinc-800">
          {course.course_category}
        </span>
      </div>

      <div className="mt-10">
        <Link
          href="/courses"
          className="inline-flex rounded-lg bg-black px-5 py-2 text-white"
        >
          Back to courses
        </Link>
      </div>
    </div>
  );
}