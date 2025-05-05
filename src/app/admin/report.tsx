import { useEffect, useState } from "react";
import { Report } from "@/types/Report";
import { ReportTable } from "@/app/components/data-table/report";

export default function ReportContent() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/admin/getDataTable/report");
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
      const res = await fetch(`http://localhost:3000/api/auth/admin/getDataTable/report/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      
      if (json.success) {
        setReports((prevReports) => prevReports.filter((report) => report.id !== id));
        alert("Report deleted successfully");
      } else {
        alert(`Failed to delete report: ${json.error}`);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Error deleting report.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ReportTable
      data={reports}
      onView={(id) => console.log("View report", id)}
      onDelete={handleDelete}  // Pass the delete handler
    />
  );
}
