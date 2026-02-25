import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function OWPPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">
              Open Work Permit (OWP) Information
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Canadian Open Work Permits
            </p>
          </div>

          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary" />
                What is an Open Work Permit?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                An Open Work Permit (OWP) allows foreign nationals to work in
                Canada for any employer, with some exceptions. Unlike
                employer-specific work permits, an open work permit is not
                job-specific and typically does not require a Labour Market
                Impact Assessment (LMIA).
              </p>
              <p>
                Open work permits provide greater flexibility for workers and
                are often issued to support specific immigration programs or
                humanitarian reasons.
              </p>
            </CardContent>
          </Card>

          {/* Types */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Types of Open Work Permits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  1. Unrestricted Open Work Permits
                </h3>
                <p className="text-muted-foreground">
                  These permits allow you to work for any employer in Canada
                  without restrictions. Common examples include:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
                  <li>
                    Spouse or common-law partner of a skilled worker or
                    international student
                  </li>
                  <li>Post-Graduation Work Permit (PGWP) holders</li>
                  <li>Permanent residence applicants in Canada</li>
                  <li>Protected persons or refugee claimants</li>
                </ul>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-lg mb-2">
                  2. Restricted Open Work Permits
                </h3>
                <p className="text-muted-foreground">
                  These permits have some limitations, such as restrictions on:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
                  <li>Geographic location where you can work</li>
                  <li>Type of work or industry</li>
                  <li>Specific conditions noted on the permit</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Important Conditions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                Important Conditions & Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900 mb-2">
                  Even with an open work permit, you cannot work in certain
                  situations:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  <li>
                    In businesses related to erotic massage, escort services, or
                    adult entertainment
                  </li>
                  <li>
                    If you do not meet the conditions stated on your work permit
                  </li>
                  <li>
                    Without meeting provincial/territorial licensing
                    requirements for your occupation
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Medical Conditions</h3>
                <p className="text-muted-foreground text-sm">
                  Certain occupations may require a medical examination,
                  including:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Healthcare workers (doctors, nurses, lab technicians)</li>
                  <li>Workers in contact with children or elderly</li>
                  <li>Agricultural workers in live animal care</li>
                  <li>Elementary or secondary school teachers</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Who Can Apply?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>You may be eligible for an open work permit if you are:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>An international student</strong> who graduated from a
                  designated Canadian institution and are eligible for the
                  Post-Graduation Work Permit Program
                </li>
                <li>
                  <strong>A spouse or common-law partner</strong> of a skilled
                  worker or international student in Canada
                </li>
                <li>
                  <strong>A refugee claimant</strong> or protected person in
                  Canada
                </li>
                <li>
                  <strong>A permanent residence applicant</strong> with an
                  application in progress
                </li>
                <li>
                  <strong>A temporary resident permit holder</strong> who
                  requires a work permit
                </li>
                <li>
                  <strong>A young person</strong> participating in special
                  programs like International Experience Canada (IEC)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How to Apply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The application process varies depending on your situation.
                Generally, you will need to:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Determine your eligibility for an open work permit</li>
                <li>
                  Gather required documents (identity documents, proof of
                  eligibility, photos, etc.)
                </li>
                <li>Pay the application fee</li>
                <li>
                  Submit your application online or at a visa application centre
                </li>
                <li>Provide biometrics if required</li>
                <li>Wait for processing (times vary by application type)</li>
              </ol>
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> For the most up-to-date information and
                  to submit an application, visit the official{" "}
                  <a
                    href="https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/work-permit.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Immigration, Refugees and Citizenship Canada (IRCC)
                  </a>{" "}
                  website.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Processing Notes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Processing & Coding Notes for Officers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Immigration officers use specific codes and notes when
                processing work permits. Common coding includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>IRPR R186:</strong> Various subsections covering
                  different categories of open work permits
                </li>
                <li>
                  <strong>R205(a):</strong> For certain humanitarian or
                  compassionate considerations
                </li>
                <li>
                  <strong>R207:</strong> For cases where public policy
                  considerations apply
                </li>
                <li>
                  <strong>R208:</strong> For vulnerable workers in specific
                  situations
                </li>
              </ul>
              <p className="mt-4">
                These codes help ensure consistent processing and identify which
                category of open work permit an applicant falls under.
              </p>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary hover:underline"
              >
                → Immigration, Refugees and Citizenship Canada (IRCC)
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/guide-5553-applying-change-conditions-extend-your-stay-canada-worker.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary hover:underline"
              >
                → Work Permit Extension Guide
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary hover:underline"
              >
                → Foreign Workers Manual (for detailed regulations)
              </a>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
