import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existingAdmin = await User.findOne({ email: "admin@example.com" });
  if (existingAdmin) return console.log("Admin already exists");

  const admin = new User({
    name: "Super Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });
  await admin.save();
  console.log("Default admin created!");
  process.exit();
};

seedAdmin();
