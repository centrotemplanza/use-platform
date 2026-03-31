import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PageProps = {
  params: {
    id: string;
  };
};

export default async function CoursePage({ params }: PageProps) {
  const response = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .single();

  const course = response.data;

  // 🔒 protección total para TypeScript + Vercel
  if (!course) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-semibold">Course not found</h1>
        <Link href="/courses" className="text-blue-500 underline mt-4 block">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{course.title}</h1>

      <p className="mt-4 text-zinc-600">{course.description}</p>

      <div className="mt-6">
        <span className="text-sm bg-zinc-200 px-3 py-1 rounded">
          {course.course_category}
        </span>
      </div>

      <div className="mt-10">
        <Link
          href="/courses"
          className="inline-block bg-black text-white px-5 py-2 rounded"
        >
          Back to courses
        </Link>
      </div>
    </div>
  );
}