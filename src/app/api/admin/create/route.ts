import { db } from "@/db";
import { user as userTable, account as accountTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // ─── Validation ───
    if (!email || !password || !name) {
      return Response.json(
        { success: false, error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return Response.json(
        { success: false, error: "Email tidak valid" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return Response.json(
        { success: false, error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // ─── Check if email already exists ───
    const existingUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUsers.length > 0) {
      return Response.json(
        { success: false, error: "Admin sudah terdaftar" },
        { status: 409 }
      );
    }

    // ─── Create admin via Better Auth (handles password hashing) ───
    try {
      const response = await auth.api.signUpEmail({
        body: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: password,
        },
      });

      if (response.user) {
        // Set role if provided (default is "admin" from schema)
        if (role && role !== "admin") {
          await db
            .update(userTable)
            .set({ role })
            .where(eq(userTable.id, response.user.id));
        }

        return Response.json({
          success: true,
          message: "Admin baru berhasil dibuat",
          admin: {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: role || "admin",
          },
        });
      }

      return Response.json(
        { success: false, error: "Gagal membuat admin" },
        { status: 500 }
      );
    } catch (err: any) {
      // Handle "already exists" error from Better Auth (race condition check)
      if (
        err?.body?.message?.toLowerCase()?.includes?.("already") ||
        err?.status === 422 ||
        err?.message?.toLowerCase()?.includes?.("already")
      ) {
        return Response.json(
          { success: false, error: "Admin sudah terdaftar" },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Create admin error:", error);
    return Response.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}