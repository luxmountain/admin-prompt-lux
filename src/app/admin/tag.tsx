import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/tag"; // Adjusted path for tags table
import { Tag } from "@/types/Tag"; // Create or update the `Tag` type for tags
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/Alert";

export default function Content() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">(
    "default"
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API for tags
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/getDataTable/tags"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setTags(data); // Assuming the response contains an array of tags
        setLoading(false);
      } catch (error) {
        setError("Failed to load tags");
        setLoading(false);
      }
    };

    fetchData();

    // Check if there's an alert message in sessionStorage
    const storedMessage = sessionStorage.getItem("tagAlertMessage");
    const storedType = sessionStorage.getItem("tagAlertType");

    if (storedMessage) {
      setAlertMessage(storedMessage);
      setAlertType(storedType as "default" | "destructive");

      // Remove from sessionStorage after displaying
      sessionStorage.removeItem("tagAlertMessage");
      sessionStorage.removeItem("tagAlertType");
    }
  }, []);

  useEffect(() => {
    // If there's an alert message, set a timer to remove it after 5 seconds
    let timer: NodeJS.Timeout;
    if (alertMessage) {
      timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000); // 5000ms = 5 seconds

      // Clean up the timer when alertMessage changes or component unmounts
      return () => clearTimeout(timer);
    }
  }, [alertMessage]); // This effect depends on the alertMessage

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/admin/getDataTable/tags/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }

      setTags((prevTags) => prevTags.filter((tag) => tag.tid !== id));

      setAlertMessage("Tag deleted successfully!");
      setAlertType("default");
    } catch (error) {
      setAlertMessage("Failed to delete tag.");
      setAlertType("destructive");
    }
  };

  // If loading or an error occurred, show loading/error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-4">
      {alertMessage && <AlertMessage type={alertType} content={alertMessage} />}

      <DataTable
        data={tags} // Pass tags data
        onEdit={(id) => {
          navigate(`/tags/edit/${id}`);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
