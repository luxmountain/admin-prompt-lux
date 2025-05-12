import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Image as ImageIcon, Heart, Tag } from "lucide-react";

interface PostData {
  pid: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
  prompt_used: string;
  edited_at: string | null;
  user: {
    uid: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar_image: string;
    role: number;
    followers_count: number;
    following_count: number;
  };
  comments: any[];
  likes_count: number;
  likes: any[];
  report_count: number;
  tags: string[];
  model_name: string;
}

const UserViewPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/admin/actions/view/${id}/pin`);
        const json = await res.json();
        setPost(json.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center text-red-500">Post not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Post Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full rounded-lg"
          />
          <p className="text-sm text-muted-foreground">
            Prompt: {post.prompt_used}
          </p>
          <p>{post.description}</p>
          <p className="text-xs text-muted-foreground">
            Created at: {new Date(post.created_at).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Creator Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Creator Info
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.user.avatar_image} />
            <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {post.user.first_name} {post.user.last_name} (@{post.user.username})
            </p>
            <p className="text-sm text-muted-foreground">UID: {post.user.uid}</p>
            <p className="text-sm text-muted-foreground">
              Followers: {post.user.followers_count} | Following: {post.user.following_count}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 text-center">
          <div>
            <p className="text-lg font-bold">{post.likes_count}</p>
            <p className="text-sm text-muted-foreground">Likes</p>
          </div>
          <div>
            <p className="text-lg font-bold">{post.comments.length}</p>
            <p className="text-sm text-muted-foreground">Comments</p>
          </div>
          <div>
            <p className="text-lg font-bold">{post.report_count}</p>
            <p className="text-sm text-muted-foreground">Reports</p>
          </div>
        </CardContent>
      </Card>

      {/* Tags and Model Name */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags and Model Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-full text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Model Name:</p>
              <p className="text-sm text-muted-foreground">{post.model_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserViewPage;
