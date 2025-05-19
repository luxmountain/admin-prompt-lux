import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/model";
import { Model } from "@/types/Model";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // <-- Alert components
import { useNavigate } from "react-router-dom";
import { Terminal } from "lucide-react";
import AlertMessage from "../components/Alert";

export default function Content() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">(
    "default"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/getDataTable/models"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setModels(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load models");
        setLoading(false);
      }
    };

    fetchData();

    // Retrieve alert message from sessionStorage if exists
    const storedMessage = sessionStorage.getItem("modelAlertMessage");
    const storedType = sessionStorage.getItem("modelAlertType");

    if (storedMessage) {
      setAlertMessage(storedMessage);
      setAlertType(storedType as "default" | "destructive");

      // Clear it so it doesn't persist across future loads
      sessionStorage.removeItem("modelAlertMessage");
      sessionStorage.removeItem("modelAlertType");
    }
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      {alertMessage && <AlertMessage type={alertType} content={alertMessage} />}

      <DataTable
        data={models}
        onView={(id) => {
          console.log("View model", id);
        }}
        onEdit={(id) => {
          navigate(`/models/edit/${id}`);
        }}
      />
    </div>
  );
}
