"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  enrolled_at: string;
  completed_at: string | null;
  courses: {
    id: string;
    title: string;
    description: string | null;
    course_type: string;
    start_date: string | null;
    end_date: string | null;
    price: number | null;
  } | null;
};

function getCertificateTitle(courseType: string | null | undefined) {
  switch (courseType) {
    case "practitioner_level_1":
      return "Practitioner Level 1 Certification";
    case "practitioner_level_2":
      return "Practitioner Level 2 Certification";
    case "practitioner_level_3":
      return "Practitioner Level 3 Certification";
    case "practitioner_level_4":
      return "Practitioner Level 4 Certification";
    case "instructor_level_1":
      return "Instructor Level 1 Certification";
    case "instructor_level_2":
      return "Instructor Level 2 Certification";
    case "instructor_level_3":
      return "Instructor Level 3 Certification";
    case "instructor_level_4":
      return "Instructor Level 4 Certification";
    default:
      return "Course Completion Certificate";
  }
}

function generateCertificateNumber(userId: string, courseId: string) {
  const shortUser = userId.replace(/-/g, "").slice(0, 8).toUpperCase();
  const shortCourse = courseId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `USE-${shortUser}-${shortCourse}`;
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadMyCourses() {
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { data, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select(`
        id,
        user_id,
        course_id,
        status,
        enrolled_at,
        completed_at,
        courses (
          id,
          title,
          description,
          course_type,
          start_date,
          end_date,
          price
        )
      `)
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false });

    if (enrollmentsError) {
      console.error("LOAD MY COURSES ERROR:", enrollmentsError);
      setError(enrollmentsError.message);
      setLoading(false);
      return;
    }

    setEnrollments((data as Enrollment[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMyCourses();
  }, []);

  async function completeCourse(enrollment: Enrollment) {
    setError(null);
    setMessage(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in.");
      return;
    }

    const { error: completeError } = await supabase
      .from("enrollments")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", enrollment.id);

    if (completeError) {
      console.error("COMPLETE COURSE ERROR:", completeError);
      setError(completeError.message);
      return;
    }

    if (
      enrollment.courses?.course_type === "practitioner_level_1" ||
      enrollment.courses?.course_type === "practitioner_level_2" ||
      enrollment.courses?.course_type === "practitioner_level_3" ||
      enrollment.courses?.course_type === "practitioner_level_4"
    ) {
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          user_level: "practitioner",
        })
        .eq("id", enrollment.user_id);

      if (profileUpdateError) {
        console.error("PROFILE LEVEL UPDATE ERROR:", profileUpdateError);
        setError(profileUpdateError.message);
        return;
      }
    }

    const certificateTitle = getCertificateTitle(
      enrollment.courses?.course_type
    );

    const certificateNumber = generateCertificateNumber(
      enrollment.user_id,
      enrollment.course_id
    );

    const { error: certificateError } = await supabase
      .from("certificates")
      .upsert(
        {
          user_id: enrollment.user_id,
          course_id: enrollment.course_id,
          certificate_type: "completion",
          certificate_title: certificateTitle,
          certificate_number: certificateNumber,
          issued_by: null,
        },
        {
          onConflict: "user_id,course_id,certificate_type",
        }
      );

    if (certificateError) {
      console.error("CREATE CERTIFICATE ERROR:", certificateError);
      setError(certificateError.message);
      return;
    }

    setMessage(
      "Course completed successfully. Your certificate has been created."
    );
    loadMyCourses();
  }

  if (loading) {
    return <main className="p-6">Loading my courses...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  return (
    <main className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">My Courses</h1>

      {message ? <p className="mt-4 text-green-600">{message}</p> : null}

      <div className="mt-6 flex flex-col gap-4">
        {enrollments.length === 0 ? (
          <p>You are not enrolled in any courses yet.</p>
        ) : (
          enrollments.map((enrollment) => (
            <div key={enrollment.id} className="border rounded p-4">
              <h2 className="text-lg font-semibold">
                {enrollment.courses?.title || "Untitled course"}
              </h2>

              <div className="mt-2 text-sm space-y-1">
                <p>
                  <strong>Status:</strong> {enrollment.status}
                </p>
                <p>
                  <strong>Type:</strong> {enrollment.courses?.course_type || "—"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {enrollment.courses?.description || "—"}
                </p>
                <p>
                  <strong>Enrolled at:</strong>{" "}
                  {new Date(enrollment.enrolled_at).toLocaleString()}
                </p>
                <p>
                  <strong>Completed at:</strong>{" "}
                  {enrollment.completed_at
                    ? new Date(enrollment.completed_at).toLocaleString()
                    : "—"}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {enrollment.courses?.id ? (
                  <Link
                    className="underline"
                    href={`/courses/${enrollment.courses.id}`}
                  >
                    View course
                  </Link>
                ) : null}

                {enrollment.status !== "completed" ? (
                  <button
                    className="border rounded px-3 py-2"
                    onClick={() => completeCourse(enrollment)}
                  >
                    Mark as completed
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}