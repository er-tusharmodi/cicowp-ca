# Cicowp-ca.com - Immigration Case Status Portal

A modern, full-stack Next.js application for managing and checking Canadian immigration case statuses, specifically focused on Open Work Permits (OWP).

## Features

### Public Features

- **Homepage** - Modern landing page with service information
- **Case Status Check** - Search for immigration cases using Document Number + Passport Number
- **OWP Information** - Comprehensive guide about Open Work Permits
- **Contact Form** - Submit inquiries and support requests
- **SEO Optimized** - Dynamic sitemap and robots.txt

### Admin Features

- **Secure Authentication** - NextAuth.js with credentials provider
- **Dashboard** - Analytics with visitor statistics and charts
- **Case Management** - Full CRUD operations for immigration cases (17 fields)
- **Admin Management** - Create and manage multiple admin users
- **Visitor Analytics** - Track page visits and user behavior

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository** (or you're already in it)

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cicowp-ca
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cicowp-ca

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Generate secret with: openssl rand -base64 32
```

4. **Seed the database**

This creates an admin user and sample cases:

```bash
npm run seed
```

**Default Admin Credentials:**

- Email: `admin@cicowp-ca.com`
- Password: `admin123`

⚠️ **Important**: Change the default password after first login!

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cicowp-ca.com/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── page.tsx             # Homepage
│   │   ├── check-status/        # Status search page
│   │   ├── contact/             # Contact form
│   │   └── owp/                 # OWP information
│   ├── admin/                   # Admin routes
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── cases/               # Case management
│   │   ├── admins/              # Admin management
│   │   └── login/               # Admin login
│   ├── api/                     # API routes
│   │   ├── auth/                # NextAuth endpoints
│   │   ├── cases/               # Case CRUD operations
│   │   ├── admins/              # Admin operations
│   │   ├── check-status/        # Public search
│   │   ├── contact/             # Contact submissions
│   │   └── analytics/           # Dashboard data
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── error.tsx                # Error boundary
│   ├── loading.tsx              # Loading state
│   ├── not-found.tsx            # 404 page
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt
├── components/                  # React components
│   ├── ui/                      # Reusable UI components
│   ├── AuthProvider.tsx         # NextAuth provider
│   ├── CaseForm.tsx             # Case create/edit form
│   ├── Navbar.tsx               # Public navigation
│   └── Footer.tsx               # Public footer
├── lib/                         # Utilities
│   ├── mongodb.ts               # DB connection
│   ├── auth.ts                  # Auth helpers
│   └── utils.ts                 # Utility functions
├── models/                      # Mongoose schemas
│   ├── Admin.ts                 # Admin user model
│   ├── Case.ts                  # Immigration case model
│   ├── Visitor.ts               # Analytics model
│   └── ContactSubmission.ts     # Contact form model
├── scripts/                     # Utility scripts
│   └── seed.ts                  # Database seeding
├── types/                       # TypeScript types
│   └── index.ts                 # Shared interfaces
└── middleware.ts                # Route protection

```

## Case Data Fields (17 Total)

Each immigration case includes:

### Personal Information

1. Full Name
2. Father's Name
3. Mother's Name
4. Date of Birth
5. Address
6. Sex (Male/Female/Other)
7. Nationality

### Document Information

8. Document Number
9. Document Issue Date
10. Document Expiry Date

### Passport Information

11. Passport Number
12. Passport Issue Date
13. Passport Expiry Date

### Case Details

14. UCI/IUC Number
15. Case Type
16. Employer (optional)
17. Employer Location (optional)
18. Display Status (boolean - show in public search)
19. Note (internal)
20. Status (Pending/In Progress/Approved/Rejected)

## Usage Guide

### For Admins

1. **Login** - Go to `/admin/login` with your credentials
2. **Dashboard** - View visitor analytics and case statistics
3. **Manage Cases** - Create, edit, search, and delete cases
4. **Manage Admins** - Create additional admin accounts
5. **View Analytics** - Track visitor traffic and searches

### For Public Users

1. **Check Status** - Go to `/check-status`
2. **Enter Details** - Provide Document Number and Passport Number
3. **View Results** - See complete case information if found

## API Routes

### Public APIs

- `POST /api/check-status` - Search for cases
- `POST /api/contact` - Submit contact form

### Admin APIs (Protected)

- `GET /api/analytics` - Dashboard analytics
- `GET /api/cases` - List all cases (with filters)
- `POST /api/cases` - Create new case
- `GET /api/cases/[id]` - Get single case
- `PUT /api/cases/[id]` - Update case
- `DELETE /api/cases/[id]` - Delete case
- `GET /api/admins` - List all admins
- `POST /api/admins` - Create new admin
- `DELETE /api/admins/[id]` - Delete admin

## Environment Configuration

### Development

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cicowp-ca
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-dev-secret
```

### Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cicowp-ca
NEXTAUTH_URL=https://cicowp-ca.com
NEXTAUTH_SECRET=your-production-secret-minimum-32-chars
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure:

- Node.js 18+
- MongoDB connection string
- Environment variables set
- Build command: `npm run build`
- Start command: `npm run start`

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based sessions
- ✅ Protected admin routes
- ✅ Input validation with Zod
- ✅ XSS protection
- ✅ CSRF protection (NextAuth)
- ✅ Rate limiting ready

## Visitor Tracking

The system automatically tracks:

- Page visits
- IP addresses
- User agents
- Timestamps
- Referrers

This data powers the admin dashboard analytics.

## Database Indexes

Optimized indexes for performance:

- Cases: `documentNumber`, `passportNumber`, compound unique index
- Admins: `email`
- Visitors: `timestamp`, `page`

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run seed      # Seed database with initial data
```

## Future Enhancements

Potential features to add:

- Email notifications for case updates
- File upload for documents
- Multi-language support
- Advanced analytics and reporting
- Export data to PDF/CSV
- SMS notifications
- Two-factor authentication
- Role-based permissions
- Case status history/timeline
- Bulk import cases

## Support

For issues or questions:

- Check the contact page at `/contact`
- Review the OWP information at `/owp`

## License

All rights reserved © 2026 Cicowp-ca.com

---

**Built with ❤️ using Next.js 14 and MongoDB**
