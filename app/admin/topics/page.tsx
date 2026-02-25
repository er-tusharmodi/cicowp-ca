"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Plus, Search, Edit, Trash2, Eye, Tag } from "lucide-react";
import { ITopic } from "@/models/Topic";

export default function TopicsManagementPage() {
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredTopics, setFilteredTopics] = useState<ITopic[]>([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = topics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(search.toLowerCase()) ||
          topic.description.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(topics);
    }
  }, [search, topics]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/topics");
      if (response.ok) {
        const result = await response.json();
        setTopics(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTopics();
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete topic");
      }
    } catch (error) {
      console.error("Failed to delete topic:", error);
      alert("Failed to delete topic");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Topics Management
          </h1>
          <p className="text-muted-foreground">
            Manage homepage topics - "Find what you need faster" section
          </p>
        </div>
        <Link href="/admin/topics/new">
          <Button className="bg-pine hover:bg-pine/90">
            <Plus className="mr-2 h-4 w-4" />
            New Topic
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              All Topics ({filteredTopics.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
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
              Loading topics...
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {search
                ? "No topics found matching your search."
                : "No topics yet. Create your first topic!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic) => (
                    <TableRow key={topic._id}>
                      <TableCell>
                        <span className="font-mono text-sm">{topic.order}</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {topic.title}
                      </TableCell>
                      <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                        {topic.description}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            topic.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {topic.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={topic.href} target="_blank">
                            <Button variant="ghost" size="sm" title="View link">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/topics/${topic._id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(topic._id!)}
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
