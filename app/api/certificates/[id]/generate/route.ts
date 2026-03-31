import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, serviceRoleKey);
}

function buildRecipientName(profile: {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
}) {
  return [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getSupabaseServerClient();

    const { data: certificate, error: certificateError } = await supabase
      .from("certificates")
      .select(`
        id,
        user_id,
        course_id,
        certificate_type,
        certificate_title,
        certificate_number,
        issued_at,
        pdf_url,
        profiles:user_id (
          first_name,
          middle_name,
          last_name,
          username
        ),
        courses:course_id (
          title,
          course_type
        )
      `)
      .eq("id", id)
      .single();

    if (certificateError || !certificate) {
      return NextResponse.json(
        { error: certificateError?.message || "Certificate not found." },
        { status: 404 }
      );
    }

    const profile = Array.isArray(certificate.profiles)
      ? certificate.profiles[0]
      : certificate.profiles;

    const course = Array.isArray(certificate.courses)
      ? certificate.courses[0]
      : certificate.courses;

    const recipientName = buildRecipientName(profile || { first_name: null, middle_name: null, last_name: null }) || "Unnamed Recipient";
    const certificateTitle =
      certificate.certificate_title || "Course Completion Certificate";
    const courseTitle = course?.title || "Untitled Course";
    const issuedDate = new Date(certificate.issued_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const certificateNumber = certificate.certificate_number || "N/A";

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // landscape A4-ish
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.985, 0.98, 0.965),
    });

    // Border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderWidth: 2,
      borderColor: rgb(0.6, 0.5, 0.3),
    });

    // Inner border
    page.drawRectangle({
      x: 42,
      y: 42,
      width: width - 84,
      height: height - 84,
      borderWidth: 0.8,
      borderColor: rgb(0.82, 0.75, 0.55),
    });

    // Brand
    page.drawText("Unified Self Evolution", {
      x: 60,
      y: height - 70,
      size: 18,
      font: fontBold,
      color: rgb(0.18, 0.18, 0.18),
    });

    // Certificate label
    page.drawText("CERTIFICATE", {
      x: width / 2 - 75,
      y: height - 150,
      size: 26,
      font: fontBold,
      color: rgb(0.35, 0.28, 0.12),
    });

    // Main title
    page.drawText(certificateTitle, {
      x: 90,
      y: height - 210,
      size: 24,
      font: fontBold,
      color: rgb(0.12, 0.12, 0.12),
      maxWidth: width - 180,
    });

    // Subtitle
    page.drawText("This certifies that", {
      x: width / 2 - 85,
      y: height - 270,
      size: 16,
      font: fontRegular,
      color: rgb(0.25, 0.25, 0.25),
    });

    // Recipient name
    const recipientSize = recipientName.length > 28 ? 24 : 30;
    page.drawText(recipientName, {
      x: 100,
      y: height - 325,
      size: recipientSize,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
      maxWidth: width - 200,
    });

    // Completion text
    page.drawText("has successfully completed the course", {
      x: width / 2 - 150,
      y: height - 375,
      size: 15,
      font: fontRegular,
      color: rgb(0.25, 0.25, 0.25),
    });

    // Course title
    page.drawText(courseTitle, {
      x: 110,
      y: height - 425,
      size: 22,
      font: fontBold,
      color: rgb(0.12, 0.12, 0.12),
      maxWidth: width - 220,
    });

    // Footer info
    page.drawText(`Issued on ${issuedDate}`, {
      x: 70,
      y: 95,
      size: 12,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(`Certificate No. ${certificateNumber}`, {
      x: 70,
      y: 72,
      size: 12,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Signature area
    page.drawLine({
      start: { x: width - 250, y: 95 },
      end: { x: width - 90, y: 95 },
      thickness: 1,
      color: rgb(0.35, 0.35, 0.35),
    });

    page.drawText("Authorized Signature", {
      x: width - 225,
      y: 72,
      size: 11,
      font: fontRegular,
      color: rgb(0.35, 0.35, 0.35),
    });

    const pdfBytes = await pdfDoc.save();

    const safeNumber = certificateNumber.replace(/[^A-Z0-9-]/gi, "_");
    const filePath = `${certificate.user_id}/${safeNumber}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("certificates")
      .upload(filePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("certificates")
      .getPublicUrl(filePath);

    const pdfUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("certificates")
      .update({ pdf_url: pdfUrl })
      .eq("id", certificate.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, pdf_url: pdfUrl });
  } catch (error) {
    console.error("GENERATE CERTIFICATE PDF ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate PDF." },
      { status: 500 }
    );
  }
}