"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EnrollmentRow = {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  courses:
    | {
        id: string;
        title: string | null;
        description: string | null;
        course_type: string | null;
      }[]
    | null;
};

type CourseCard = {
  id: string;
  title: string;
  description: string;
  courseType: string;
  status: string;
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setErrorMessage("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setErrorMessage("Could not load user.");
          setLoading(false);
          return;
        }

        if (!user) {
          setCourses([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("enrollments")
          .select(
            `
              id,
              user_id,
              course_id,
              status,
              courses (
                id,
                title,
                description,
                course_type
              )
            `
          )
          .eq("user_id", user.id);

        if (error) {
          setErrorMessage("Could not load courses.");
          setLoading(false);
          return;
        }

        const rows = (data ?? []) as EnrollmentRow[];

        const mapped: CourseCard[] = rows.map((row) => {
          const course =
            Array.isArray(row.courses) && row.courses.length > 0
              ? row.courses[0]
              : null;

          return {
            id: course?.id ?? row.course_id,
            title: course?.title ?? "Untitled course",
            description: course?.description ?? "",
            courseType: course?.course_type ?? "unknown",
            status: row.status,
          };
        });

        setCourses(mapped);
      } catch {
        setErrorMessage("Unexpected error loading courses.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold">My Courses</h1>
        <p className="mt-4 text-sm text-zinc-600">Loading courses...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold">My Courses</h1>
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">My Courses</h1>
        <Link
          href="/courses"
          className="text-sm border px-4 py-2 rounded"
        >
          Browse courses
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="mt-8">
          <p className="text-zinc-600">
            You are not enrolled in any courses yet.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-xl p-5 bg-white"
            >
              <h2 className="text-lg font-semibold">{course.title}</h2>

              <p className="mt-2 text-sm text-zinc-600">
                {course.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs bg-zinc-200 px-2 py-1 rounded">
                  {course.courseType}
                </span>

                <Link
                  href={`/courses/${course.id}`}
                  className="text-sm underline"
                >
                  Go to course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}