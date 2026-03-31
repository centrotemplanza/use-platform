import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateUsername } from "@/lib/username";

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          available: false,
          code: "server_env_missing",
          message: "Server environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const username = request.nextUrl.searchParams.get("username") ?? "";
    const validation = validateUsername(username);

    if (!validation.isValid) {
      return NextResponse.json({
        available: false,
        normalized: validation.normalized,
        code: validation.code ?? "invalid",
        message: validation.message,
      });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", validation.normalized)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          available: false,
          normalized: validation.normalized,
          code: "database_error",
          message: error.message || "Could not verify username right now.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      available: !data,
      normalized: validation.normalized,
      code: data ? "taken" : "available",
      message: data
        ? "This username is already in use."
        : "Username available.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        available: false,
        code: "unexpected_error",
        message:
          error instanceof Error
            ? error.message
            : "Could not verify username right now.",
      },
      { status: 500 }
    );
  }
}