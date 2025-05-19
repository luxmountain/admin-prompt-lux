import { useState, useEffect } from "react";
import { DataTable } from "@/app/components/data-table/user";
import { AdminUser } from "@/types/AdminUser";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function Content() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive">(
    "default"
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/getDataTable/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      {/* Alert Message */}
      {alertMessage && (
        <Alert variant={alertType} className="fixed bottom-8 right-8 z-50 w-80">
          <Terminal className="h-4 w-4" />
          <AlertTitle>
            {alertType === "destructive" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <DataTable
        data={users}
        onRoleChange={async (uid, roleValue) => {
          const roleMap = { admin: 1, user: 0 };
          const newRole = roleMap[roleValue as keyof typeof roleMap] as 0 | 1;

          try {
            const response = await fetch(
              `http://localhost:3000/api/auth/admin/getDataTable/users/${uid}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ newRole }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to update user role");
            }

            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.uid === uid ? { ...user, role: newRole } : user
              )
            );

            setAlertMessage("User role updated successfully");
            setAlertType("default");
          } catch (error) {
            console.error("Error updating role:", error);
            setAlertMessage("Failed to update role");
            setAlertType("destructive");
          }
        }}
        onView={(uid) => navigate(`/users/${uid}`)}
        onDelete={async (uid) => {
          try {
            const response = await fetch(
              `http://localhost:3000/api/auth/admin/getDataTable/users/${uid}/delete`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error("Failed to delete user");
            }

            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.uid !== uid)
            );

            setAlertMessage("User deleted successfully");
            setAlertType("default");
          } catch (error) {
            console.error("Error deleting user:", error);
            setAlertMessage("Failed to delete user");
            setAlertType("destructive");
          }
        }}
      />
    </div>
  );
}
