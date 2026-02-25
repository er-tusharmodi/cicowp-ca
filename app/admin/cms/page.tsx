"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Setting {
  key: string;
  value: any;
  type: string;
  category: string;
  label: string;
  placeholder?: string;
  description?: string;
}

interface LinkItem {
  text: string;
  href: string;
}

export default function CMSPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [message, setMessage] = useState("");

  // State for managing array fields
  const [arrayData, setArrayData] = useState<Record<string, LinkItem[]>>({});
  const [editingIndex, setEditingIndex] = useState<
    Record<string, number | null>
  >({});
  const [formData, setFormData] = useState<Record<string, LinkItem>>({});

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      const grouped = data as Record<string, Setting[]>;

      // Flatten grouped settings into a single object keyed by key
      const flat: Record<string, Setting> = {};
      Object.values(grouped).forEach((categorySettings: Setting[]) => {
        categorySettings.forEach((setting: Setting) => {
          flat[setting.key] = setting;

          // Parse array fields
          if (
            setting.type === "json" &&
            (setting.key === "footer_useful_links" ||
              setting.key === "quicklinks_data")
          ) {
            try {
              const parsed =
                typeof setting.value === "string"
                  ? JSON.parse(setting.value)
                  : setting.value;
              setArrayData((prev) => ({
                ...prev,
                [setting.key]: parsed || [],
              }));
              setEditingIndex((prev) => ({
                ...prev,
                [setting.key]: null,
              }));
            } catch (e) {
              console.error("Failed to parse array field:", e);
            }
          }
        });
      });

      setSettings(flat);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  const handleAddLink = (key: string) => {
    const newLink = formData[key] || { text: "", href: "" };
    if (!newLink.text.trim() || !newLink.href.trim()) {
      setMessage("Please fill in all fields");
      return;
    }

    const updatedArray = [...(arrayData[key] || []), newLink];
    setArrayData((prev) => ({
      ...prev,
      [key]: updatedArray,
    }));
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: JSON.stringify(updatedArray),
      },
    }));
    setFormData((prev) => ({
      ...prev,
      [key]: { text: "", href: "" },
    }));
  };

  const handleEditLink = (key: string, index: number) => {
    const link = arrayData[key]?.[index];
    if (link) {
      setEditingIndex((prev) => ({
        ...prev,
        [key]: index,
      }));
      setFormData((prev) => ({
        ...prev,
        [key]: { ...link },
      }));
    }
  };

  const handleUpdateLink = (key: string, index: number) => {
    const updatedLink = formData[key];
    if (!updatedLink?.text.trim() || !updatedLink?.href.trim()) {
      setMessage("Please fill in all fields");
      return;
    }

    const updatedArray = [...(arrayData[key] || [])];
    updatedArray[index] = updatedLink;

    setArrayData((prev) => ({
      ...prev,
      [key]: updatedArray,
    }));
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: JSON.stringify(updatedArray),
      },
    }));
    setEditingIndex((prev) => ({
      ...prev,
      [key]: null,
    }));
    setFormData((prev) => ({
      ...prev,
      [key]: { text: "", href: "" },
    }));
  };

  const handleDeleteLink = (key: string, index: number) => {
    const updatedArray = arrayData[key]?.filter((_, i) => i !== index) || [];
    setArrayData((prev) => ({
      ...prev,
      [key]: updatedArray,
    }));
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: JSON.stringify(updatedArray),
      },
    }));
    setEditingIndex((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const saveSingleSetting = async (setting: Setting, newValue: any) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          key: setting.key,
          value: newValue,
          type: setting.type,
          category: setting.category,
          label: setting.label,
          placeholder: setting.placeholder,
          description: setting.description,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Failed to save setting");
      }

      return true;
    } catch (error) {
      console.error("Failed to save setting:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save setting";
      setMessage(`Failed to save image: ${errorMessage}`);
      return false;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      // Prepare data for batch update
      const updates = Object.values(settings).map((setting) => ({
        key: setting.key,
        value: setting.value,
        type: setting.type,
        category: setting.category,
        label: setting.label,
        placeholder: setting.placeholder,
        description: setting.description,
      }));

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      setMessage("✓ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("✗ Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pine mx-auto mb-4"></div>
          <p className="text-ink/60">Loading settings...</p>
        </div>
      </div>
    );
  }

  const renderField = (setting: Setting) => {
    const { key, value, type, label, placeholder, description } = setting;

    switch (type) {
      case "textarea":
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-ink">{label}</label>
            {description && (
              <p className="text-xs text-ink/60">{description}</p>
            )}
            <textarea
              value={value || ""}
              onChange={(e) => handleSettingChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-mist/40 rounded-md bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent"
              rows={4}
            />
          </div>
        );
      case "number":
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-ink">{label}</label>
            {description && (
              <p className="text-xs text-ink/60">{description}</p>
            )}
            <Input
              type="number"
              value={value || ""}
              onChange={(e) => handleSettingChange(key, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        );
      case "url":
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-ink">{label}</label>
            {description && (
              <p className="text-xs text-ink/60">{description}</p>
            )}
            <Input
              type="url"
              value={value || ""}
              onChange={(e) => handleSettingChange(key, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        );
      case "boolean":
        return (
          <div key={key} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={key}
              checked={value || false}
              onChange={(e) => handleSettingChange(key, e.target.checked)}
              className="w-4 h-4 rounded border-mist/40 text-pine focus:ring-pine cursor-pointer"
            />
            <label
              htmlFor={key}
              className="text-sm font-medium text-ink cursor-pointer"
            >
              {label}
            </label>
            {description && (
              <p className="text-xs text-ink/60">{description}</p>
            )}
          </div>
        );
      case "json":
        // Special handling for link arrays
        if (key === "footer_useful_links" || key === "quicklinks_data") {
          const links = arrayData[key] || [];
          const isEditing = editingIndex[key] !== null;
          const currentForm = formData[key] || { text: "", href: "" };

          return (
            <div key={key} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ink">{label}</label>
                {description && (
                  <p className="text-xs text-ink/60">{description}</p>
                )}
              </div>

              {/* Add/Edit Form */}
              <Card className="border-mist/40 p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Link text"
                      value={currentForm.text}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: { ...currentForm, text: e.target.value },
                        }))
                      }
                      className="border-mist/40"
                    />
                    <Input
                      placeholder="URL (e.g., /page or https://...)"
                      value={currentForm.href}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: { ...currentForm, href: e.target.value },
                        }))
                      }
                      className="border-mist/40"
                    />
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() =>
                            handleUpdateLink(key, editingIndex[key]!)
                          }
                          className="bg-pine hover:bg-pine/90 text-white"
                        >
                          Update Link
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingIndex((prev) => ({
                              ...prev,
                              [key]: null,
                            }));
                            setFormData((prev) => ({
                              ...prev,
                              [key]: { text: "", href: "" },
                            }));
                          }}
                          variant="outline"
                          className="border-mist/40"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleAddLink(key)}
                        className="bg-pine hover:bg-pine/90 text-white gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Link
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Links List */}
              <div className="space-y-2">
                {links.length === 0 ? (
                  <p className="text-sm text-ink/60 py-4">
                    No links yet. Add one to get started.
                  </p>
                ) : (
                  links.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border border-mist/40 rounded-md bg-mist/20 hover:bg-mist/40 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {link.text}
                        </p>
                        <p className="text-xs text-ink/60 truncate">
                          {link.href}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditLink(key, idx)}
                          className="border-mist/40 p-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLink(key, idx)}
                          className="border-red-200 text-red-600 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        }

        // Fallback to textarea for other JSON
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-ink">{label}</label>
            {description && (
              <p className="text-xs text-ink/60">{description}</p>
            )}
            <textarea
              value={
                typeof value === "string"
                  ? value
                  : JSON.stringify(value, null, 2)
              }
              onChange={(e) => {
                try {
                  handleSettingChange(key, JSON.parse(e.target.value));
                } catch {
                  handleSettingChange(key, e.target.value);
                }
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-mist/40 rounded-md bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent font-mono text-sm"
              rows={6}
            />
          </div>
        );
      case "image":
        return (
          <div key={key} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">{label}</label>
              {description && (
                <p className="text-xs text-ink/60">{description}</p>
              )}
            </div>

            {/* Image Preview */}
            {value && (
              <div className="relative inline-block">
                <img
                  src={value}
                  alt={label}
                  className="max-w-xs h-auto rounded-lg border border-mist/40 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://cicowp-ca.com/public/images/1710775539_ec11ec459e3d79b74fd5.jpeg";
                  }}
                />
                <button
                  onClick={() => handleSettingChange(key, "")}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Upload Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-mist/40 rounded-lg cursor-pointer hover:bg-mist/10 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-ink/40 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-xs text-ink/60">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Create form data
                      const formData = new FormData();
                      formData.append("file", file);

                      try {
                        const response = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                          credentials: "include",
                        });

                        const result = await response.json().catch(() => ({}));

                        if (!response.ok) {
                          throw new Error(result.error || "Upload failed");
                        }

                        handleSettingChange(key, result.url);
                        const saved = await saveSingleSetting(
                          setting,
                          result.url,
                        );
                        if (!saved) return;
                        setMessage("✓ Image uploaded and saved!");
                        setTimeout(() => setMessage(""), 3000);
                      } catch (error) {
                        console.error("Upload error:", error);
                        const errorMessage =
                          error instanceof Error
                            ? error.message
                            : "Upload failed";
                        setMessage(`Failed to upload image: ${errorMessage}`);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-ink/60">
                Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
              </p>
            </div>
          </div>
        );
      case "string":
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-ink">{label}</label>
            {description && (
              <p className="text-xs text-ink/60">{description}</p>
            )}
            <Input
              type="text"
              value={value || ""}
              onChange={(e) => handleSettingChange(key, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        );
    }
  };

  const getSettingsByCategory = (category: string) => {
    return Object.values(settings)
      .filter((s) => s.category === category)
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Website CMS</h1>
        <p className="text-ink/60 mt-1">
          Manage all website content and settings from here
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md text-sm font-medium ${
            message.includes("✓")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <Card className="border-mist/40 bg-white">
        <CardHeader className="border-b border-mist/40 pb-4">
          <CardTitle className="text-ink">Settings</CardTitle>
          <CardDescription>
            Configure all website content and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="quicklinks">Quick Links</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-6 mt-6">
              <div className="space-y-6">
                {getSettingsByCategory("hero").map((setting) =>
                  renderField(setting),
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6 mt-6">
              <div className="space-y-6">
                {getSettingsByCategory("stats").map((setting) =>
                  renderField(setting),
                )}
              </div>
            </TabsContent>

            <TabsContent value="quicklinks" className="space-y-6 mt-6">
              <div className="space-y-6">
                {getSettingsByCategory("quicklinks").map((setting) =>
                  renderField(setting),
                )}
              </div>
            </TabsContent>

            <TabsContent value="footer" className="space-y-6 mt-6">
              <div className="space-y-6">
                {getSettingsByCategory("footer").map((setting) =>
                  renderField(setting),
                )}
              </div>
            </TabsContent>

            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="space-y-6">
                {getSettingsByCategory("general").map((setting) =>
                  renderField(setting),
                )}
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 mt-6">
              <div className="space-y-6">
                {getSettingsByCategory("seo").map((setting) =>
                  renderField(setting),
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-mist/40">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-pine hover:bg-pine/90 text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <p className="text-sm text-ink/60">
              All changes are saved to the database and visible on the website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
