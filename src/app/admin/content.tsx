import { useState, useEffect } from "react";
import { PinTable } from "@/app/components/data-table/content";
import { Pin } from "@/types/Pin";

export default function Content() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/admin/getDataTable/pins");
        if (!response.ok) throw new Error("Failed to fetch pins");
        const data = await response.json();
        setPins(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPins();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PinTable
      data={pins}
      onView={(pid) => console.log("View pin", pid)}
      onDelete={(pid) => console.log("Delete pin", pid)}
    />
  );
}
