"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RawCertificateRow = {
  id: string;
  certificate_type: string | null;
  certificate_title: string | null;
  issued_at: string | null;
  pdf_url: string | null;
  courses:
    | {
        id: string;
        title: string | null;
        course_type: string | null;
      }[]
    | null;
};

type CertificateCard = {
  id: string;
  certificateType: string;
  certificateTitle: string;
  issuedAt: string | null;
  pdfUrl: string | null;
  course: {
    id: string;
    title: string;
    courseType: string;
  } | null;
};

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true);
        setErrorMessage("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setErrorMessage("Could not load the current user.");
          setLoading(false);
          return;
        }

        if (!user) {
          setCertificates([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("certificates")
          .select(
            `
              id,
              certificate_type,
              certificate_title,
              issued_at,
              pdf_url,
              courses (
                id,
                title,
                course_type
              )
            `
          )
          .eq("user_id", user.id)
          .order("issued_at", { ascending: false });

        if (error) {
          setErrorMessage("Could not load certificates.");
          setLoading(false);
          return;
        }

        const rows = (data ?? []) as RawCertificateRow[];

        const mapped: CertificateCard[] = rows.map((row) => {
          const firstCourse =
            Array.isArray(row.courses) && row.courses.length > 0
              ? row.courses[0]
              : null;

          return {
            id: row.id,
            certificateType: row.certificate_type ?? "Certificate",
            certificateTitle: row.certificate_title ?? "Untitled certificate",
            issuedAt: row.issued_at,
            pdfUrl: row.pdf_url,
            course: firstCourse
              ? {
                  id: firstCourse.id,
                  title: firstCourse.title ?? "Untitled course",
                  courseType: firstCourse.course_type ?? "unknown",
                }
              : null,
          };
        });

        setCertificates(mapped);
      } catch {
        setErrorMessage("Something went wrong while loading certificates.");
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-zinc-950">
          My Certificates
        </h1>
        <p className="mt-4 text-sm text-zinc-600">Loading certificates...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-zinc-950">
          My Certificates
        </h1>
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-950">
            My Certificates
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Review the certificates you have already earned.
          </p>
        </div>

        <Link
          href="/courses"
          className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
        >
          Browse courses
        </Link>
      </div>

      {certificates.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-zinc-950">
            No certificates yet
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Once you complete eligible courses, your certificates will appear
            here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                {certificate.certificateType}
              </p>

              <h2 className="mt-3 text-xl font-semibold text-zinc-950">
                {certificate.certificateTitle}
              </h2>

              {certificate.course ? (
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-zinc-700">
                    <span className="font-medium text-zinc-950">Course:</span>{" "}
                    {certificate.course.title}
                  </p>
                  <p className="text-sm text-zinc-600">
                    <span className="font-medium text-zinc-950">Type:</span>{" "}
                    {certificate.course.courseType}
                  </p>
                </div>
              ) : null}

              <p className="mt-4 text-sm text-zinc-600">
                <span className="font-medium text-zinc-950">Issued:</span>{" "}
                {certificate.issuedAt
                  ? new Date(certificate.issuedAt).toLocaleDateString()
                  : "Date unavailable"}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {certificate.pdfUrl ? (
                  <a
                    href={certificate.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Open PDF
                  </a>
                ) : null}

                {certificate.course ? (
                  <Link
                    href={`/courses/${certificate.course.id}`}
                    className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                  >
                    View course
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}