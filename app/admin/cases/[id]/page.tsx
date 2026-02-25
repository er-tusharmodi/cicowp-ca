import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import CaseForm from "@/components/CaseForm";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";

async function getCase(id: string) {
  try {
    await dbConnect();
    const caseData = await Case.findById(id).lean();

    if (!caseData) {
      return null;
    }

    // Convert MongoDB document to plain object with string dates
    return JSON.parse(JSON.stringify(caseData));
  } catch (error) {
    console.error("Failed to fetch case:", error);
    return null;
  }
}

export default async function EditCasePage({
  params,
}: {
  params: { id: string };
}) {
  const caseData = await getCase(params.id);

  if (!caseData) {
    notFound();
  }

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
        <h1 className="text-3xl font-bold">Edit Case</h1>
        <p className="text-muted-foreground mt-1">
          Update case information for {caseData.fullName}
        </p>
      </div>

      <CaseForm initialData={caseData} isEdit={true} />
    </div>
  );
}
