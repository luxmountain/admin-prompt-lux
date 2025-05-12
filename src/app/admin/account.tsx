"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Ensure Avatar is imported
import { useAdminUser } from "@/hooks/useAdminUser";

export default function AccountPage() {
  const user = useAdminUser();

  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Avatar</Label>
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.avatar_image ?? "/default-avatar.png"}
                alt="Avatar"
              />
              <AvatarFallback>
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={user.email} readOnly />
          </div>
          <div className="grid gap-2">
            <Label>Username</Label>
            <Input value={user.name} readOnly />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>First Name</Label>
              <Input value={user.first_name ?? ""} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Last Name</Label>
              <Input value={user.last_name ?? ""} readOnly />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Bio</Label>
            <Textarea value={user.bio ?? ""} readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
