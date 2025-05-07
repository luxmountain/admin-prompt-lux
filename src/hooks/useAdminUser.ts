// src/hooks/useAdminUser.ts
import { useEffect, useState } from "react";
import axios from "axios";

export function useAdminUser() {
  const [user, setUser] = useState<null | {
    bio: string;
    last_name: string;
    first_name: string;
    username: string | number | readonly string[] | undefined;
    name: string;
    email: string;
    avatar_image?: string;
  }>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3000/api/auth/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.admin);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setUser(null); // or maybe set to a fallback user
      });
  }, []);

  return user;
}
