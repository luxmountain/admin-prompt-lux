import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // <-- Import Alert components

export default function EditTagPage() {
  const { id } = useParams();  // Get the id from the URL
  const [tagContent, setTagContent] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">("default");
  const navigate = useNavigate();

  // Fetch tag data when the component mounts to populate the form
  useEffect(() => {
    const fetchTagData = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/auth/admin/actions/add/tag/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tag data");
        }

        const tag = await response.json();
        setTagContent(tag.tag_content);
        setTagDescription(tag.tag_description || "");
      } catch (error) {
        setAlertMessage(error.message || "Failed to fetch tag data.");
        setAlertType("destructive");
      }
    };

    fetchTagData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      const response = await fetch(`http://localhost:3000/api/auth/admin/actions/add/tag/${id}/put`, {
        method: "PUT",  // Use PUT method to update the tag
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(id),  // Include the tag ID for the PUT request
          tag_content: tagContent,
          tag_description: tagDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Handle duplicate tag content error
        if (response.status === 409 && data.message === "Tag content already exists") {
          setAlertMessage("Tag content already exists.");
          setAlertType("destructive");
        } else {
          throw new Error(data.message || "Failed to update tag");
        }
      } else {
        sessionStorage.setItem("tagAlertMessage", "Tag updated successfully!");
        sessionStorage.setItem("tagAlertType", "default");
        navigate("/tags");
      }
    } catch (error) {
      setAlertMessage(error.message || "Failed to update tag.");
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
          <CardTitle>Edit Tag</CardTitle>
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
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
