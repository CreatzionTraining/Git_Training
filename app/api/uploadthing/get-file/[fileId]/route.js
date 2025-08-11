export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/mongo";
import Upload from "@/models/Upload";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    const { fileId } = params;

    // ✅ Validate fileId before using it
    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing file ID" }),
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      passwordEnabled = false,
      password = "",
      emailTo = null
    } = body || {};

    await connectDB();

    const fileDoc = await Upload.findById(fileId);
    if (!fileDoc) {
      return new Response(
        JSON.stringify({ error: "File not found" }),
        { status: 404 }
      );
    }

    // ✅ Handle password protection
    if (passwordEnabled) {
      if (!password || password.trim().length < 1) {
        return new Response(
          JSON.stringify({
            error: "Password required when enabling protection"
          }),
          { status: 400 }
        );
      }
      const hash = await bcrypt.hash(password, 10);
      fileDoc.passwordHash = hash;
    } else {
      fileDoc.passwordHash = null;
    }

    fileDoc.passwordEnabled = Boolean(passwordEnabled);
    fileDoc.emailTo = emailTo && emailTo.trim() !== "" ? emailTo : null;

    await fileDoc.save();

    return new Response(
      JSON.stringify({
        ok: true,
        message: "File settings updated successfully",
        fileId: fileDoc._id.toString()
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /api/get-file/[fileId] error:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
