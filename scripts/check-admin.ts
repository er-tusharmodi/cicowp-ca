import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
dotenv.config({ path: join(process.cwd(), ".env.local") });

import bcrypt from "bcryptjs";
import dbConnect from "../lib/mongodb";
import Admin from "../models/Admin";

async function checkAdmin() {
  try {
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    const admin = await Admin.findOne({ email: "admin@cicowp-ca.com" });

    if (admin) {
      console.log("\n✅ Admin user found:");
      console.log("   Email:", admin.email);
      console.log("   Name:", admin.name);
      console.log("   Role:", admin.role);

      // Test password
      const testPassword = "admin123";
      const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
      console.log("\n🔑 Password test:");
      console.log("   Testing password: admin123");
      console.log("   Password valid:", isValid ? "✅ YES" : "❌ NO");

      if (!isValid) {
        console.log("\n⚠️  Password doesn't match! Let me reset it...");
        const newPasswordHash = await bcrypt.hash("admin123", 10);
        admin.passwordHash = newPasswordHash;
        await admin.save();
        console.log("✅ Password reset to: admin123");
      }
    } else {
      console.log("❌ Admin user not found!");
      console.log("Creating admin user...");

      const passwordHash = await bcrypt.hash("admin123", 10);
      await Admin.create({
        email: "admin@cicowp-ca.com",
        passwordHash,
        name: "Admin User",
        role: "super-admin",
      });
      console.log("✅ Admin user created");
      console.log("   Email: admin@cicowp-ca.com");
      console.log("   Password: admin123");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkAdmin();
