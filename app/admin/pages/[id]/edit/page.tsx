"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { IPage } from "@/models/Page";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<IPage>>({
    title: "",
    slug: "",
    content: "",
    metaDescription: "",
    isPublished: false,
    showInNav: false,
    navOrder: 0,
  });

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages/${params.id}`);
      if (response.ok) {
        const result = await response.json();
        setFormData(result.data);
      } else {
        setError("Failed to load page");
      }
    } catch (err) {
      setError("Failed to load page");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/pages/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/admin/pages");
        router.refresh();
      } else {
        setError(result.message || "Failed to update page");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pine mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Page</h1>
          <p className="text-muted-foreground">
            Update page content and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Page Title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="page-slug"
                    required
                    pattern="[a-z0-9-]+"
                    title="Only lowercase letters, numbers, and hyphens"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /pages/{formData.slug || "page-slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your page content here... (HTML supported)"
                    required
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use HTML tags for formatting
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder="Brief description for SEO (max 160 characters)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaDescription?.length || 0}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        isPublished: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Published
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showInNav"
                    checked={formData.showInNav}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        showInNav: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="showInNav"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show in Navigation
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="navOrder">Navigation Order</Label>
                  <Input
                    id="navOrder"
                    type="number"
                    value={formData.navOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        navOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pine hover:bg-pine/90"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
