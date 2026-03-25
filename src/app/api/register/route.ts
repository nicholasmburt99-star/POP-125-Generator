import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password, name, inviteCode } = await request.json();

    // Validate invite code
    const expectedCode = process.env.INVITE_SECRET;
    console.log("INVITE_SECRET defined:", !!expectedCode, "received:", inviteCode);
    if (!expectedCode || inviteCode !== expectedCode) {
      return NextResponse.json(
        { error: `Invalid invite code (env set: ${!!expectedCode})` },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email });
  } catch {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
