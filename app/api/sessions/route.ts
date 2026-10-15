import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";


function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    // Reject requests from a different browser origin.
    const origin = request.headers.get("origin");
    const appOrigin = new URL(request.url).origin;

    if (origin !== appOrigin) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const rawTokenValue = String(body.tokenValue ?? "").trim();
    const tokenValue = Number(rawTokenValue);

    if (name.length < 1 || name.length > 100) {
      return NextResponse.json(
        { error: "Session name must be between 1 and 100 characters." },
        { status: 400 }
      );
    }

    if (
      !/^\d+(\.\d{1,4})?$/.test(rawTokenValue) ||
      !Number.isFinite(tokenValue) ||
      tokenValue <= 0
    ) {
      return NextResponse.json(
        { error: "Enter a positive token value with up to 4 decimal places." },
        { status: 400 }
      );
    }

    // Generate independent, unpredictable credentials.
    const hostToken = randomBytes(32).toString("base64url");
    const inviteToken = randomBytes(32).toString("base64url");

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        name,
        token_value: tokenValue,
        host_token_hash: hashToken(hostToken),
        invite_token_hash: hashToken(inviteToken),
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Session creation failed:", error?.message);

      return NextResponse.json(
        { error: "Could not create session." },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        sessionId: data.id,
        inviteUrl: `${appOrigin}/join/${data.id}?invite=${inviteToken}`,
      },
      { status: 201 }
    );

    response.cookies.set(`poker_host_${data.id}`, hostToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request or server configuration." },
      { status: 400 }
    );
  }
}
