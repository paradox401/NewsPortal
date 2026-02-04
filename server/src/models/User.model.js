import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "editor", "reporter"], default: "reporter" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // no need to hash if password unchanged
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
