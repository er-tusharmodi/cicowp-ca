export interface ICase {
  _id?: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: Date;
  address: string;
  documentNumber: string;
  documentIssueDate: Date;
  documentExpiryDate: Date;
  passportNumber: string;
  passportIssueDate: Date;
  passportExpiryDate: Date;
  sex: "Male" | "Female" | "Other";
  nationality: string;
  uciNumber: string;
  caseType: string;
  employer?: string;
  employerLocation?: string;
  displayStatus: boolean;
  note?: string;
  status: "Pending" | "Approved" | "Rejected" | "In Progress";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdmin {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "super-admin";
  createdAt?: Date;
  lastLogin?: Date;
}

export interface IVisitor {
  _id?: string;
  ip: string;
  page: string;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
  country?: string;
}

export interface IContactSubmission {
  _id?: string;
  fullName: string;
  mobile: string;
  email?: string;
  subject: string;
  message: string;
  createdAt?: Date;
}
