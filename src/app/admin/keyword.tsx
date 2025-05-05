import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/keyword"; // Adjusted import path to new Keyword DataTable
import { Keyword } from "@/types/Keyword"; // Import the new Keyword type

export default function Content() {
  const [keywords, setKeywords] = useState<Keyword[]>([]); // Changed state to keywords
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/getDataTable/keyword"
        ); // Adjusted to the keywords API endpoint

        if (!response.ok) {
          throw new Error("Failed to fetch keywords");
        }

        const data = await response.json();
        setKeywords(data); // assuming the response contains an array of keywords
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      setKeywords((prevKeywords) =>
        prevKeywords.filter((keyword) => keyword.id !== id)
      );
      alert("Keyword deleted successfully!");
    } catch (error) {
      setError("Failed to delete keyword");
      alert("Error: Failed to delete keyword.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DataTable
      data={keywords}
      onView={(id) => {
        console.log("View keyword", id);
      }}
      onDelete={handleDelete}
    />
  );
}
