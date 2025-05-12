import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

interface Post {
  pid: number;
  title?: string;
  description: string;
  created_at: string;
  image_url?: string;
  like_count: number;
  comment_count: number;
  report_count: number;
}

interface User {
  uid: number;
  username: string;
  avatar_image?: string;
  bio?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  created_at: string;
  role?: number;
  followers_count: number;
  following_count: number;
  reported_user_count: number;
  reported_posts_count: number;
  posts: Post[];
}

const UserViewPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/auth/admin/actions/view/${id}/user`
        );
        const json = await res.json();
        if (res.ok) {
          setUser(json.data);
        } else {
          setError(json.message || "Failed to fetch user");
        }
      } catch (err) {
        setError("Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar_image} alt={user.username} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {user.first_name} {user.last_name} (@{user.username})
            </h2>
            <h3 className="text-md mb-2">Email: {user.email}</h3>
            <p className="text-sm text-muted-foreground">
              Bio: {user.bio || "No bio provided"}
            </p>
            <div className="mt-2 space-x-2">
              <Badge>ID: {user.uid}</Badge>
              <Badge>Followers: {user.followers_count}</Badge>
              <Badge>Following: {user.following_count}</Badge>
              <Badge variant="secondary">
                Role: {user.role == 1 ? "Admin" : "User"}
              </Badge>
              <Badge variant="outline">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </Badge>
              <div className="flex gap-4 mt-4">
                {/* Reported User Count */}
                <div className="flex items-center gap-2">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <span>{user.reported_user_count} Reports</span>
                </div>
                {/* Reported Posts Count */}
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-red-500" />
                  <span>{user.reported_posts_count} Post Reports</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.posts.length === 0 ? (
            <p className="text-muted-foreground">No posts found.</p>
          ) : (
            user.posts.map((post) => (
              <div
                key={post.pid}
                className="p-4 border rounded-xl shadow-sm space-y-2"
              >
                <h3 className="font-medium text-lg line-clamp-1">
                  ID: {post.pid || "(No title)"}
                </h3>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg line-clamp-3">
                    {post.title || "(No title)"}
                  </h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-4">
                  {post.image_url && (
                    <div className="w-64 h-100 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between flex-1">
                    <p className="text-sm mb-2 line-clamp-5">
                      {post.description}
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <HeartIcon className="w-5 h-5" />
                        {post.like_count}
                      </span>
                      <span className="flex items-center gap-2">
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                        {post.comment_count}
                      </span>
                      <span className="flex items-center gap-2">
                        <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                        {post.report_count} Reports
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserViewPage;
