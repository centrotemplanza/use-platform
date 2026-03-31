"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Course = {
  id: string;
  title: string;
  description: string | null;
  course_type: string;
  course_category: string;
  price: number | null;
  start_date: string | null;
  end_date: string | null;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCourses() {
    setLoading(true);

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("start_date", { ascending: true });

    if (!error && data) {
      setCourses(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  if (loading) {
    return <main className="p-6">Loading courses...</main>;
  }

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Courses</h1>

      <div className="mt-6 space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{course.title}</h2>

            <p className="text-sm mt-1">
              Type: {course.course_type}
            </p>

            <p className="text-sm">
              Category: {course.course_category}
            </p>

            <p className="text-sm mt-2">
              {course.description || "—"}
            </p>

            <p className="text-sm mt-2">
              Start:{" "}
              {course.start_date
                ? new Date(course.start_date).toLocaleString()
                : "—"}
            </p>

            <p className="text-sm">
              End:{" "}
              {course.end_date
                ? new Date(course.end_date).toLocaleString()
                : "—"}
            </p>

            <p className="text-sm mt-2">
              Price: {course.price ?? 0}
            </p>

            <div className="mt-3">
              <Link
                href={`/courses/${course.id}`}
                className="underline"
              >
                View course
              </Link>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="mt-6 text-sm">No courses available.</p>
      )}
    </main>
  );
}