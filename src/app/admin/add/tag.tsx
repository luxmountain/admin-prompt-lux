"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // <-- Import Alert components

export default function CreateTagPage() {
  const [tagContent, setTagContent] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">("default");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/admin/actions/add/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag_content: tagContent,
          tag_description: tagDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create tag");
      }

      sessionStorage.setItem("tagAlertMessage", "Tag created successfully!");
      sessionStorage.setItem("tagAlertType", "default");
      navigate("/tags");
    } catch (error) {
      setAlertMessage(error.message || "Failed to create tag.");
      setAlertType("destructive");
      console.error(error);
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <div className="w-[800px] mx-auto py-10">
      {/* Alert Message */}
      {alertMessage && (
        <Alert
          variant={alertType}
          className="fixed bottom-8 right-8 z-50 w-80"
        >
          <AlertTitle>
            {alertType === "destructive" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Tag</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Tag Content */}
            <div className="grid gap-4 mb-8">
              <Label className="text-lg">Tag Content</Label>
              <Input
                type="text"
                value={tagContent}
                onChange={(e) => setTagContent(e.target.value)}
                placeholder="Enter tag content"
                required
                className="w-full h-12"
              />
            </div>

            {/* Tag Description */}
            <div className="grid gap-4">
              <Label className="text-lg">Tag Description</Label>
              <Textarea
                value={tagDescription}
                onChange={(e) => setTagDescription(e.target.value)}
                placeholder="Enter a description for the tag"
                required
                className="w-full h-48"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <Button type="submit" className="w-full sm:w-auto">
                Create Tag
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
