import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/model";  // Adjusted import path
import { Model } from "@/types/Model"; // Updated type import

export default function Content() {
  const [models, setModels] = useState<Model[]>([]); // Changed state to models
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API for models
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/admin/getDataTable/models");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setModels(data); // Assuming the response contains an array of models
        setLoading(false);
      } catch (error) {
        setError("Failed to load models");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/admin/getDataTable/models/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete model");
      }

      // Update state to remove the deleted model
      setModels((prevModels) => prevModels.filter((model) => model.mid !== id));

      // Show success alert
      alert("Model deleted successfully!");
    } catch (error) {
      setError("Failed to delete model");
      // Show error alert
      alert("Error: Failed to delete model.");
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
    <DataTable
      data={models} // Pass models data
      onView={(id) => {
        console.log("View model", id);
      }}
      onEdit={handleDelete} // Pass the handleDelete function to the DataTable
    />
  );
}
