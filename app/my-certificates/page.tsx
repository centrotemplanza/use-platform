"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Certificate = {
  id: string;
  certificate_type: string;
  certificate_title: string | null;
  certificate_number: string | null;
  pdf_url: string | null;
  issued_at: string;
  courses: {
    id: string;
    title: string;
    course_type: string;
  } | null;
};

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  async function loadCertificates() {
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

    const { data, error: certificatesError } = await supabase
      .from("certificates")
      .select(`
        id,
        certificate_type,
        certificate_title,
        certificate_number,
        pdf_url,
        issued_at,
        courses (
          id,
          title,
          course_type
        )
      `)
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (certificatesError) {
      setError(certificatesError.message);
      setLoading(false);
      return;
    }

    setCertificates((data as Certificate[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  async function generatePdf(certificateId: string) {
    setGeneratingId(certificateId);
    setError(null);

    try {
      const response = await fetch(
        `/api/certificates/${certificateId}/generate`,
        { method: "POST" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate PDF.");
      }

      await loadCertificates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating PDF");
    } finally {
      setGeneratingId(null);
    }
  }

  if (loading) return <main className="p-6">Loading...</main>;
  if (error) return <main className="p-6 text-red-600">{error}</main>;

  return (
    <main className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">My Certificates</h1>

      <div className="mt-6 flex flex-col gap-4">
        {certificates.length === 0 ? (
          <p>No certificates yet.</p>
        ) : (
          certificates.map((certificate) => (
            <div key={certificate.id} className="border rounded p-4">
              <h2 className="text-lg font-semibold">
                {certificate.certificate_title}
              </h2>

              <p>Certificate number: {certificate.certificate_number}</p>
              <p>Course: {certificate.courses?.title}</p>

              <div className="mt-4">
                {certificate.pdf_url ? (
                  <a
                    href={certificate.pdf_url}
                    target="_blank"
                    className="underline"
                  >
                    Download PDF
                  </a>
                ) : (
                  <button
                    onClick={() => generatePdf(certificate.id)}
                    className="border px-3 py-2 rounded"
                  >
                    {generatingId === certificate.id
                      ? "Generating..."
                      : "Generate PDF"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}