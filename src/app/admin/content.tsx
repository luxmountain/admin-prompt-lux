import { useState, useEffect } from "react";
import { PinTable } from "@/app/components/data-table/content";
import { Pin } from "@/types/Pin";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/Alert";

export default function Content() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">(
    "default"
  );

  const navigate = useNavigate();

  const fetchPins = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/auth/admin/getDataTable/pins"
      );
      if (!response.ok) throw new Error("Failed to fetch pins");
      const data = await response.json();
      setPins(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  // Tự động ẩn alert sau 5s
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Hàm xóa pin theo id
  const deletePin = async (pid: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/admin/getDataTable/pins/${pid}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete pin");
      }

      setAlertMessage("Pin deleted successfully");
      setAlertType("default");

      await fetchPins();
    } catch (error: any) {
      setAlertMessage("Error deleting pin: " + error.message);
      setAlertType("destructive");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      {/* Alert Message */}
      {alertMessage && <AlertMessage type={alertType} content={alertMessage} />}

      <PinTable
        data={pins}
        onView={(pid) => navigate(`/pins/${pid}`)}
        onDelete={(pid) => deletePin(pid)}
      />
    </div>
  );
}
