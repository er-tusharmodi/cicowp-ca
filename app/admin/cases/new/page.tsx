import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CaseForm from "@/components/CaseForm";

export default function NewCasePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/cases"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Cases
        </Link>
        <h1 className="text-3xl font-bold">Add New Case</h1>
        <p className="text-muted-foreground mt-1">
          Create a new immigration case record
        </p>
      </div>

      <CaseForm />
    </div>
  );
}
