"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICase } from "@/types";

interface CaseFormProps {
  initialData?: ICase;
  isEdit?: boolean;
}

export default function CaseForm({
  initialData,
  isEdit = false,
}: CaseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Partial<ICase>>({
    fullName: initialData?.fullName || "",
    fatherName: initialData?.fatherName || "",
    motherName: initialData?.motherName || "",
    dateOfBirth: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
      : "",
    address: initialData?.address || "",
    documentNumber: initialData?.documentNumber || "",
    documentIssueDate: initialData?.documentIssueDate
      ? new Date(initialData.documentIssueDate).toISOString().split("T")[0]
      : "",
    documentExpiryDate: initialData?.documentExpiryDate
      ? new Date(initialData.documentExpiryDate).toISOString().split("T")[0]
      : "",
    passportNumber: initialData?.passportNumber || "",
    passportIssueDate: initialData?.passportIssueDate
      ? new Date(initialData.passportIssueDate).toISOString().split("T")[0]
      : "",
    passportExpiryDate: initialData?.passportExpiryDate
      ? new Date(initialData.passportExpiryDate).toISOString().split("T")[0]
      : "",
    sex: initialData?.sex || "Male",
    nationality: initialData?.nationality || "",
    uciNumber: initialData?.uciNumber || "",
    caseType: initialData?.caseType || "",
    employer: initialData?.employer || "",
    employerLocation: initialData?.employerLocation || "",
    displayStatus: initialData?.displayStatus ?? true,
    note: initialData?.note || "",
    status: initialData?.status || "Pending",
  } as any);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEdit ? `/api/cases/${initialData?._id}` : "/api/cases";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/admin/cases");
        router.refresh();
      } else {
        setError(result.error || "Failed to save case");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth as any}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father&apos;s Name *</Label>
              <Input
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother&apos;s Name *</Label>
              <Input
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sex">Sex *</Label>
              <Select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Information */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number *</Label>
              <Input
                id="documentNumber"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                required
                disabled={loading}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentIssueDate">Issue Date *</Label>
              <Input
                id="documentIssueDate"
                name="documentIssueDate"
                type="date"
                value={formData.documentIssueDate as any}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentExpiryDate">Expiry Date *</Label>
              <Input
                id="documentExpiryDate"
                name="documentExpiryDate"
                type="date"
                value={formData.documentExpiryDate as any}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passport Information */}
      <Card>
        <CardHeader>
          <CardTitle>Passport Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number *</Label>
              <Input
                id="passportNumber"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                required
                disabled={loading}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportIssueDate">Issue Date *</Label>
              <Input
                id="passportIssueDate"
                name="passportIssueDate"
                type="date"
                value={formData.passportIssueDate as any}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportExpiryDate">Expiry Date *</Label>
              <Input
                id="passportExpiryDate"
                name="passportExpiryDate"
                type="date"
                value={formData.passportExpiryDate as any}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Details */}
      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uciNumber">UCI/IUC Number *</Label>
              <Input
                id="uciNumber"
                name="uciNumber"
                value={formData.uciNumber}
                onChange={handleChange}
                required
                disabled={loading}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseType">Case Type *</Label>
              <Input
                id="caseType"
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., Work Permit, Study Permit"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employer">Employer</Label>
              <Input
                id="employer"
                name="employer"
                value={formData.employer}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employerLocation">Employer Location</Label>
              <Input
                id="employerLocation"
                name="employerLocation"
                value={formData.employerLocation}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="displayStatus"
                  checked={formData.displayStatus}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">
                  Display in public search
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Notes</Label>
            <Textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              placeholder="Internal notes about this case..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Case" : "Create Case"}
        </Button>
      </div>
    </form>
  );
}
