import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/keyword";
import { Keyword } from "@/types/Keyword";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // <-- Import your Alert components

export default function Content() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">("default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/getDataTable/keyword"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch keywords");
        }

        const data = await response.json();
        setKeywords(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load keywords");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/admin/getDataTable/keyword/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete keyword");
      }

      setKeywords((prev) => prev.filter((keyword) => keyword.id !== id));
      setAlertType("default");
      setAlertMessage("Keyword deleted successfully!");
    } catch (error) {
      setAlertType("destructive");
      setAlertMessage("Failed to delete keyword.");
    }
  };

  // Optional: Auto-clear alert after a few seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      {alertMessage && (
        <Alert variant={alertType}>
          <AlertTitle>
            {alertType === "destructive" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <DataTable
        data={keywords}
        onView={(id) => {
          console.log("View keyword", id);
        }}
        onEdit={(id) => {
          console.log("Edit keyword", id);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
