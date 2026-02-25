import bcrypt from "bcryptjs";
import dbConnect from "../lib/mongodb";
import Admin from "../models/Admin";
import Case from "../models/Case";
import Page from "../models/Page";
import Topic from "../models/Topic";

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

    // Create sample pages
    const pageCount = await Page.countDocuments();

    if (pageCount === 0) {
      const samplePages = [
        {
          title: "About Us",
          slug: "about-us",
          content: `
            <h2>About Cicowp-ca</h2>
            <p>Welcome to Cicowp-ca, your trusted partner in Canadian immigration services. We are dedicated to helping individuals and families navigate the complex immigration process with ease and confidence.</p>
            
            <h3>Our Mission</h3>
            <p>Our mission is to provide accurate, timely, and comprehensive immigration information and services to those seeking to make Canada their home.</p>
            
            <h3>Our Services</h3>
            <ul>
              <li>Case status tracking</li>
              <li>Open Work Permit (OWP) guidance</li>
              <li>Immigration consultation</li>
              <li>Document processing assistance</li>
            </ul>
            
            <h3>Why Choose Us?</h3>
            <p>With years of experience in Canadian immigration, we understand the challenges and opportunities that come with the process. Our team is committed to providing personalized support tailored to your unique situation.</p>
          `,
          metaDescription:
            "Learn about Cicowp-ca and our mission to help you with Canadian immigration services.",
          isPublished: true,
          showInNav: true,
          navOrder: 4,
        },
        {
          title: "FAQ",
          slug: "faq",
          content: `
            <h2>Frequently Asked Questions</h2>
            
            <h3>How long does the immigration process take?</h3>
            <p>The timeline varies depending on the type of application and current processing times. Express Entry applications typically take 6 months, while family sponsorship can take 12-24 months.</p>
            
            <h3>Can I check my case status online?</h3>
            <p>Yes! Use our <a href="/check-status">Check Status</a> page to track your application using your document and passport numbers.</p>
            
            <h3>What is an Open Work Permit (OWP)?</h3>
            <p>An Open Work Permit allows you to work for any employer in Canada. Learn more on our <a href="/owp">OWP page</a>.</p>
            
            <h3>Do I need a lawyer for immigration?</h3>
            <p>While not mandatory, an immigration consultant or lawyer can help ensure your application is complete and accurate, potentially avoiding delays.</p>
            
            <h3>How can I contact you?</h3>
            <p>You can reach us through our <a href="/contact">Contact page</a>. We typically respond within 24-48 hours.</p>
          `,
          metaDescription:
            "Find answers to common questions about Canadian immigration, work permits, and our services.",
          isPublished: true,
          showInNav: true,
          navOrder: 5,
        },
      ];

      await Page.insertMany(samplePages);
      console.log(`✅ Created ${samplePages.length} sample pages`);
    } else {
      console.log(`⚠️  ${pageCount} pages already exist`);
    }

    // Create sample topics
    const topicCount = await Topic.countDocuments();

    if (topicCount === 0) {
      const sampleTopics = [
        {
          title: "Benefits",
          description:
            "EI, family and sickness leave, pensions, housing, student aid, disabilities.",
          href: "https://www.canada.ca/en/services/benefits.html",
          isActive: true,
          order: 1,
        },
        {
          title: "Business and industry",
          description:
            "Starting a business, permits, copyrights, support, and government selling.",
          href: "https://www.canada.ca/en/services/business.html",
          isActive: true,
          order: 2,
        },
        {
          title: "Canada and the world",
          description:
            "Foreign policy, trade agreements, development work, and global issues.",
          href: "https://www.international.gc.ca/world-monde/index.aspx?lang=eng",
          isActive: true,
          order: 3,
        },
        {
          title: "Culture, history and sport",
          description:
            "Arts, media, heritage, official languages, and national identity.",
          href: "https://www.canada.ca/en/services/culture.html",
          isActive: true,
          order: 4,
        },
        {
          title: "Environment and natural resources",
          description:
            "Weather, climate, agriculture, wildlife, pollution, and conservation.",
          href: "https://www.canada.ca/en/services/environment.html",
          isActive: true,
          order: 5,
        },
        {
          title: "Health",
          description:
            "Food, nutrition, diseases, vaccines, drugs, safety, and recalls.",
          href: "https://www.canada.ca/en/services/health.html",
          isActive: true,
          order: 6,
        },
        {
          title: "Indigenous peoples",
          description:
            "Programs and services for First Nations, Inuit, and Metis communities.",
          href: "https://www.canada.ca/en/indigenous-northern-affairs.html",
          isActive: true,
          order: 7,
        },
        {
          title: "Money and finances",
          description:
            "Personal finance, credit reports, fraud protection, and education support.",
          href: "https://www.canada.ca/en/services/finance.html",
          isActive: true,
          order: 8,
        },
        {
          title: "National security and defence",
          description:
            "Military, border security, cyber security, and counter-terrorism.",
          href: "https://www.canada.ca/en/services/defence.html",
          isActive: true,
          order: 9,
        },
        {
          title: "Policing, justice and emergencies",
          description:
            "Public safety, justice system, preparedness, and victim services.",
          href: "https://www.canada.ca/en/services/policing.html",
          isActive: true,
          order: 10,
        },
        {
          title: "Science and innovation",
          description:
            "Research on health, environment, space, grants, and funding.",
          href: "https://www.canada.ca/en/services/science.html",
          isActive: true,
          order: 11,
        },
        {
          title: "Taxes",
          description:
            "Income tax, payroll, GST/HST, limits, credits, and charities.",
          href: "https://www.canada.ca/en/services/taxes.html",
          isActive: true,
          order: 12,
        },
        {
          title: "Transport and infrastructure",
          description:
            "Aviation, marine, road, rail, dangerous goods, and projects.",
          href: "https://www.canada.ca/en/services/transport.html",
          isActive: true,
          order: 13,
        },
        {
          title: "Travel and tourism",
          description:
            "Travel advice, advisories, passports, events, attractions, and visits.",
          href: "https://travel.gc.ca/",
          isActive: true,
          order: 14,
        },
        {
          title: "Veterans",
          description:
            "Services for current and former military, RCMP, and families.",
          href: "https://www.canada.ca/en/services/veterans-military.html",
          isActive: true,
          order: 15,
        },
        {
          title: "Youth",
          description: "Programs and services for teenagers and young adults.",
          href: "https://www.canada.ca/en/services/youth.html",
          isActive: true,
          order: 16,
        },
      ];

      await Topic.insertMany(sampleTopics);
      console.log(`✅ Created ${sampleTopics.length} sample topics`);
    } else {
      console.log(`⚠️  ${topicCount} topics already exist`);
    }

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📝 You can now:");
    console.log("   1. Login to admin panel at /admin/login");
    console.log("   2. Manage topics at /admin/topics");
    console.log("   3. Manage pages at /admin/pages");
    console.log("   4. Search for cases at /check-status");
    console.log("   5. Example search: D12345678 + AB1234567\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
