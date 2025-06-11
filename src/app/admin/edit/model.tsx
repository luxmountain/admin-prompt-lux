import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditModelPage() {
  const { id } = useParams();  // Get the id from the URL
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [modelLink, setModelLink] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">("default");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModelData = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/auth/admin/actions/add/model/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch model data");
        }

        const model = await response.json();
        setModelName(model.model_name);
        setModelDescription(model.model_description || "");
        setModelLink(model.model_link || "");
      } catch (error) {
        setAlertMessage((error as Error).message || "Failed to fetch model data.");
        setAlertType("destructive");
      }
    };

    fetchModelData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      const response = await fetch(`http://localhost:3000/api/auth/admin/actions/add/model/${id}/put`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(id),
          model_name: modelName,
          model_description: modelDescription,
          model_link: modelLink,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409 && data.message === "Model name already exists") {
          setAlertMessage("Model name already exists.");
          setAlertType("destructive");
        } else {
          throw new Error(data.message || "Failed to update model");
        }
      } else {
        sessionStorage.setItem("modelAlertMessage", "Model updated successfully!");
        sessionStorage.setItem("modelAlertType", "default");
        navigate("/models");
      }
    } catch (error) {
      setAlertMessage((error as Error).message || "Failed to update model.");
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
          <CardTitle>Edit Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Model Name */}
            <div className="grid gap-4 mb-8">
              <Label className="text-lg">Model Name</Label>
              <Input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter model name"
                required
                className="w-full h-12"
              />
            </div>

            {/* Model Description */}
            <div className="grid gap-4 mb-8">
              <Label className="text-lg">Model Description</Label>
              <Textarea
                value={modelDescription}
                onChange={(e) => setModelDescription(e.target.value)}
                placeholder="Enter a description for the model"
                required
                className="w-full h-48"
              />
            </div>

            {/* Model Link */}
            <div className="grid gap-4">
              <Label className="text-lg">Model Link</Label>
              <Input
                type="text"
                value={modelLink}
                onChange={(e) => setModelLink(e.target.value)}
                placeholder="Enter a link for the model"
                required
                className="w-full h-12"
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
