"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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

type Profile = {
  id: string;
  therapist_accredited: boolean;
};

type Enrollment = {
  id: string;
  status: string;
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  async function loadData() {
    setLoading(true);
    setMessage(null);

    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError) {
      setLoading(false);
      setMessage(courseError.message);
      return;
    }

    setCourse(courseData);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, therapist_accredited")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: enrollmentData } = await supabase
        .from("enrollments")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      setEnrollment(enrollmentData);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function enroll() {
    setMessage(null);
    setEnrolling(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in.");
      setEnrolling(false);
      return;
    }

    if (enrollment) {
      setMessage("You are already enrolled in this course.");
      setEnrolling(false);
      return;
    }

    if (
      course?.course_category === "instructor" &&
      !profile?.therapist_accredited
    ) {
      setMessage("Only accredited therapists can enroll in this course.");
      setEnrolling(false);
      return;
    }

    const { error } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: course.id,
      status: "enrolled",
    });

    if (error) {
      setMessage(error.message);
      setEnrolling(false);
      return;
    }

    setMessage("Successfully enrolled.");
    setEnrolling(false);
    await loadData();
  }

  if (loading) return <main className="p-6">Loading...</main>;
  if (!course) return <main className="p-6">Course not found.</main>;

  const isInstructor = course.course_category === "instructor";
  const canEnroll =
    !isInstructor || (isInstructor && profile?.therapist_accredited);

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold">{course.title}</h1>

      <div className="mt-4 space-y-2">
        <p>
          <strong>Type:</strong> {course.course_type}
        </p>
        <p>
          <strong>Category:</strong> {course.course_category}
        </p>
        <p>
          <strong>Description:</strong> {course.description || "—"}
        </p>
        <p>
          <strong>Start:</strong>{" "}
          {course.start_date
            ? new Date(course.start_date).toLocaleString()
            : "—"}
        </p>
        <p>
          <strong>End:</strong>{" "}
          {course.end_date
            ? new Date(course.end_date).toLocaleString()
            : "—"}
        </p>
        <p>
          <strong>Price:</strong> {course.price ?? 0}
        </p>
      </div>

      <div className="mt-6">
        {enrollment ? (
          <div className="border p-4 rounded bg-gray-50">
            <p className="font-semibold">You are already enrolled in this course</p>
            <p className="text-sm mt-1">
              Current status: <strong>{enrollment.status}</strong>
            </p>
            <div className="mt-3">
              <Link className="underline" href="/my-courses">
                Go to My Courses
              </Link>
            </div>
          </div>
        ) : canEnroll ? (
          <button
            onClick={enroll}
            className="border px-4 py-2 rounded"
            disabled={enrolling}
          >
            {enrolling ? "Enrolling..." : "Enroll in this course"}
          </button>
        ) : (
          <div className="border p-4 rounded bg-gray-50">
            <p className="font-semibold">
              Available for accredited therapists only
            </p>
            <p className="text-sm mt-1">
              Complete your practitioner certification to unlock this training.
            </p>
          </div>
        )}
      </div>

      {message && (
        <p className="mt-4 text-sm text-blue-600">{message}</p>
      )}
    </main>
  );
}