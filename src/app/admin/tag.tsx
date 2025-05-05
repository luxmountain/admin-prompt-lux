import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/tag";  // Adjusted path for tags table
import { Tag } from "@/types/Tag"; // Create or update the `Tag` type for tags

export default function Content() {
  const [tags, setTags] = useState<Tag[]>([]); // Changed to tags
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API for tags
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/admin/getDataTable/tags");

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
  }, []);

  const handleDelete = async (id: number) => {
    try {
      console.log("Deleting tag with ID:", id); // Debugging line
      const response = await fetch(`http://localhost:3000/api/auth/admin/getDataTable/tags/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }

      setTags((prevTags) => prevTags.filter((tag) => tag.tid !== id));
      alert("Tag deleted successfully!");
    } catch (error) {
      setError("Failed to delete tag");
      // Show error alert
      alert("Error: Failed to delete tag.");
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
      data={tags} // Pass tags data
      onView={(id) => {
        console.log("View tag", id);
      }}
      onDelete={handleDelete} // Pass the handleDelete function to the DataTable
    />
  );
}
