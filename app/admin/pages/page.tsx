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
import { Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react";
import { IPage } from "@/models/Page";

export default function PagesManagementPage() {
  const router = useRouter();
  const [pages, setPages] = useState<IPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredPages, setFilteredPages] = useState<IPage[]>([]);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = pages.filter(
        (page) =>
          page.title.toLowerCase().includes(search.toLowerCase()) ||
          page.slug.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredPages(filtered);
    } else {
      setFilteredPages(pages);
    }
  }, [search, pages]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pages");
      if (response.ok) {
        const result = await response.json();
        setPages(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPages();
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete page");
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
      alert("Failed to delete page");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pages Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage dynamic pages for your website
          </p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="bg-pine hover:bg-pine/90">
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Pages
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search pages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading pages...
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {search
                ? "No pages found matching your search."
                : "No pages yet. Create your first page!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>In Nav</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page._id}>
                      <TableCell className="font-medium">
                        {page.title}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          /{page.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            page.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {page.isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {page.showInNav ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>{page.navOrder}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(page.updatedAt || "").toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/pages/${page.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/pages/${page._id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(page._id!)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
