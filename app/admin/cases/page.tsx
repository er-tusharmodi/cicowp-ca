"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { ICase } from "@/types";
import { formatDateShort } from "@/lib/utils";

interface CaseResponse {
  cases: ICase[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export default function CasesPage() {
  const router = useRouter();
  const [data, setData] = useState<CaseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCases();
  }, [page, status]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(status && { status }),
      });

      const response = await fetch(`/api/cases?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCases();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case?")) return;

    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCases();
      } else {
        alert("Failed to delete case");
      }
    } catch (error) {
      console.error("Failed to delete case:", error);
      alert("Failed to delete case");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cases</h1>
          <p className="text-muted-foreground mt-1">
            Manage immigration case records
          </p>
        </div>
        <Link href="/admin/cases/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Case
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, document, passport, or UCI number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {data ? `${data.pagination.total} Cases` : "Loading..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading cases...
            </div>
          ) : !data || data.cases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cases found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Document Number</TableHead>
                    <TableHead>Passport Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.cases.map((caseItem) => (
                    <TableRow key={caseItem._id}>
                      <TableCell className="font-medium">
                        {caseItem.fullName}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {caseItem.documentNumber}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {caseItem.passportNumber}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            caseItem.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : caseItem.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : caseItem.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {caseItem.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {caseItem.createdAt
                          ? formatDateShort(caseItem.createdAt)
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/cases/${caseItem._id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(caseItem._id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data.pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {data.pagination.pages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) => Math.min(data.pagination.pages, p + 1))
                    }
                    disabled={page === data.pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
