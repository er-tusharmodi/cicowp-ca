"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Shield } from "lucide-react";
import { IAdmin } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminsPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins");
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete admin: ${email}?`)) return;

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        fetchAdmins();
      } else {
        alert(result.error || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);
      alert("Failed to delete admin");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage administrator accounts
          </p>
        </div>
        <Link href="/admin/admins/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{admins.length} Administrators</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading admins...
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No admins found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => {
                  const isCurrentUser =
                    (session?.user as any)?.id === admin._id;
                  return (
                    <TableRow key={admin._id}>
                      <TableCell className="font-medium">
                        {admin.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="capitalize">{admin.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {admin.createdAt ? formatDate(admin.createdAt) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleString("en-CA")
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(admin._id!, admin.email)}
                          disabled={isCurrentUser}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
