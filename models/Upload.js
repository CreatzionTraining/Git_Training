// models/Upload.js
import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true }, // store size in bytes
    fileType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    folder: { type: String, default: null },

    shortUrl: { type: String, required: true, unique: true },

    // NEW: security fields
    passwordEnabled: { type: Boolean, default: false },
    passwordHash: { type: String, default: null }, // hashed password
    emailTo: { type: String, default: null }, // optional email address to send the link

    // user info
    userEmail: { type: String, default: null },
    username: { type: String, default: null },

    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true } // adds createdAt + updatedAt
);

export default mongoose.models.Upload || mongoose.model("Upload", UploadSchema);
