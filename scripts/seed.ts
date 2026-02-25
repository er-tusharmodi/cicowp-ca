import bcrypt from "bcryptjs";
import dbConnect from "../lib/mongodb";
import Admin from "../models/Admin";
import Case from "../models/Case";

async function seed() {
  console.log("Starting database seed...");

  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    // Create admin user
    const existingAdmin = await Admin.findOne({ email: "admin@cicowp-ca.com" });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await Admin.create({
        email: "admin@cicowp-ca.com",
        passwordHash,
        name: "Admin User",
        role: "super-admin",
      });
      console.log("✅ Created admin user");
      console.log("   Email: admin@cicowp-ca.com");
      console.log("   Password: admin123");
    } else {
      console.log("⚠️  Admin user already exists");
    }

    // Create sample cases
    const caseCount = await Case.countDocuments();

    if (caseCount === 0) {
      const sampleCases = [
        {
          fullName: "John Smith",
          fatherName: "Robert Smith",
          motherName: "Mary Smith",
          dateOfBirth: new Date("1990-05-15"),
          address: "123 Main Street, Toronto, ON M5V 2A1",
          documentNumber: "D12345678",
          documentIssueDate: new Date("2023-01-15"),
          documentExpiryDate: new Date("2025-01-15"),
          passportNumber: "AB1234567",
          passportIssueDate: new Date("2022-06-10"),
          passportExpiryDate: new Date("2032-06-10"),
          sex: "Male",
          nationality: "Indian",
          uciNumber: "UCI123456789",
          caseType: "Open Work Permit",
          employer: "Tech Solutions Inc.",
          employerLocation: "Toronto, ON",
          displayStatus: true,
          note: "Application in review",
          status: "In Progress",
        },
        {
          fullName: "Sarah Johnson",
          fatherName: "Michael Johnson",
          motherName: "Linda Johnson",
          dateOfBirth: new Date("1995-08-22"),
          address: "456 Oak Avenue, Vancouver, BC V6B 1A1",
          documentNumber: "D98765432",
          documentIssueDate: new Date("2023-03-20"),
          documentExpiryDate: new Date("2025-03-20"),
          passportNumber: "CD9876543",
          passportIssueDate: new Date("2022-12-05"),
          passportExpiryDate: new Date("2032-12-05"),
          sex: "Female",
          nationality: "Filipino",
          uciNumber: "UCI987654321",
          caseType: "Study Permit with Work Authorization",
          employer: "University of British Columbia",
          employerLocation: "Vancouver, BC",
          displayStatus: true,
          note: "Documents verified, awaiting final decision",
          status: "Pending",
        },
        {
          fullName: "Ahmed Hassan",
          fatherName: "Mohammed Hassan",
          motherName: "Fatima Hassan",
          dateOfBirth: new Date("1988-11-30"),
          address: "789 Elm Street, Montreal, QC H3A 1A1",
          documentNumber: "D11223344",
          documentIssueDate: new Date("2022-09-10"),
          documentExpiryDate: new Date("2024-09-10"),
          passportNumber: "EF1122334",
          passportIssueDate: new Date("2021-03-15"),
          passportExpiryDate: new Date("2031-03-15"),
          sex: "Male",
          nationality: "Egyptian",
          uciNumber: "UCI112233445",
          caseType: "Post-Graduation Work Permit",
          employer: "Software Development Corp",
          employerLocation: "Montreal, QC",
          displayStatus: true,
          note: "Approved - Work permit issued",
          status: "Approved",
        },
        {
          fullName: "Maria Garcia",
          fatherName: "Carlos Garcia",
          motherName: "Isabella Garcia",
          dateOfBirth: new Date("1992-03-18"),
          address: "321 Pine Road, Calgary, AB T2P 1A1",
          documentNumber: "D55667788",
          documentIssueDate: new Date("2023-02-01"),
          documentExpiryDate: new Date("2025-02-01"),
          passportNumber: "GH5566778",
          passportIssueDate: new Date("2022-08-20"),
          passportExpiryDate: new Date("2032-08-20"),
          sex: "Female",
          nationality: "Mexican",
          uciNumber: "UCI556677889",
          caseType: "Spousal Open Work Permit",
          displayStatus: true,
          note: "Application incomplete - additional documents requested",
          status: "Pending",
        },
        {
          fullName: "David Chen",
          fatherName: "Wei Chen",
          motherName: "Li Chen",
          dateOfBirth: new Date("1985-07-25"),
          address: "654 Maple Drive, Ottawa, ON K1A 0B1",
          documentNumber: "D99887766",
          documentIssueDate: new Date("2022-05-15"),
          documentExpiryDate: new Date("2024-05-15"),
          passportNumber: "IJ9988776",
          passportIssueDate: new Date("2021-10-10"),
          passportExpiryDate: new Date("2031-10-10"),
          sex: "Male",
          nationality: "Chinese",
          uciNumber: "UCI998877665",
          caseType: "Open Work Permit",
          employer: "Government of Canada",
          employerLocation: "Ottawa, ON",
          displayStatus: true,
          note: "Application rejected - ineligibility reasons provided",
          status: "Rejected",
        },
      ];

      await Case.insertMany(sampleCases);
      console.log(`✅ Created ${sampleCases.length} sample cases`);
    } else {
      console.log("⚠️  Sample cases already exist");
    }

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📝 You can now:");
    console.log("   1. Login to admin panel at /admin/login");
    console.log("   2. Search for cases at /check-status");
    console.log("   3. Example search: D12345678 + AB1234567\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
