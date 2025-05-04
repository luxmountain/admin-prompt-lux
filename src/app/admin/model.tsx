import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/model";  // Adjusted import path
import { Model } from "@/types/Model"; // Updated type import

export default function Content() {
  const [models, setModels] = useState<Model[]>([]); // Changed state to models
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/admin/getDataTable/models");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setModels(data); // assuming the response contains an array of models
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to load models");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // If loading or an error occurred, show loading/error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DataTable
      data={models}
      onView={(mid) => {
        console.log("View model", mid);
      }}
      onDelete={(mid) => {
        console.log("Delete model", mid);
      }}
    />
  );
}
