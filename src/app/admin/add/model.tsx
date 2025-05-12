"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateModelPage() {
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">("default");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/admin/actions/add/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_name: modelName,
          model_description: modelDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create model");
      }

      sessionStorage.setItem("modelAlertMessage", "Model created successfully!");
      sessionStorage.setItem("modelAlertType", "default");
      navigate("/models");
    } catch (error) {
      setAlertMessage((error as Error).message || "Failed to create model.");
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
          <CardTitle>Create Model</CardTitle>
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
            <div className="grid gap-4">
              <Label className="text-lg">Model Description</Label>
              <Textarea
                value={modelDescription}
                onChange={(e) => setModelDescription(e.target.value)}
                placeholder="Enter a description for the model"
                required
                className="w-full h-48"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <Button type="submit" className="w-full sm:w-auto">
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
