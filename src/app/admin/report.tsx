import { useEffect, useState } from "react";
import { Report } from "@/types/Report";
import { ReportTable } from "@/app/components/data-table/report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // <-- Alert components

export default function ReportContent() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">(
    "default"
  );

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/auth/admin/getDataTable/report"
        );
        const json = await res.json();
        setReports(json.data);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/admin/getDataTable/report/${id}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();

      if (json.success) {
        setReports((prevReports) =>
          prevReports.filter((report) => report.id !== id)
        );
        setAlertMessage("Report deleted successfully.");
        setAlertType("default");
      } else {
        setAlertMessage(`Failed to delete report: ${json.error}`);
        setAlertType("destructive");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      setAlertMessage("Error deleting report.");
      setAlertType("destructive");
    }
  };
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {alertMessage && (
        <Alert variant={alertType} className="fixed bottom-8 right-8 z-50 w-80">
          <AlertTitle>
            {alertType === "destructive" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <ReportTable
        data={reports}
        onView={(id) => console.log("View report", id)}
        onDelete={handleDelete}
      />
    </>
  );
}
