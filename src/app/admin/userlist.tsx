import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/user";
import { AdminUser } from "@/types/AdminUser";
import { useNavigate } from 'react-router-dom';

export default function Content() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
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
      onRoleChange={async (uid, roleValue) => {
        const roleMap = {
          admin: 1,
          user: 0,
        };
      
        const newRole = roleMap[roleValue as keyof typeof roleMap] as 0 | 1;
        
        try {
          const response = await fetch(`http://localhost:3000/api/auth/admin/getDataTable/users/${uid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newRole }),
          });
      
          if (!response.ok) {
            throw new Error("Failed to update user role");
          }
      
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.uid === uid ? { ...user, role: newRole } : user
            )
          );
      
          console.log(`User ${uid} role updated to ${newRole}`);
        } catch (error) {
          console.error("Error updating role:", error);
          alert("Failed to update role");
        }
      }}
      
      onView={(uid) => {
        navigate(`/users/${uid}`);
      }}
      onDelete={(uid) => {
        console.log("Delete user", uid);
      }}
    />
  );
}
