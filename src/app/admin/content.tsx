import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/content";
import { AdminUser } from "@/types/AdminUser";

export default function Content() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/admin/getDataTable/users");
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setUsers(data); // assuming the response contains an array of AdminUser
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to load users");
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
      data={users}
      onRoleChange={(uid, newRole) => {
        console.log("Role changed", uid, newRole);
        // Update DB here
      }}
      onView={(uid) => {
        console.log("View user", uid);
      }}
      onDelete={(uid) => {
        console.log("Delete user", uid);
      }}
    />
  );
}
