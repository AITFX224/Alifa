import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MapPin, Clock, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLikes } from "@/hooks/useLikes";
import { CommentsSection } from "@/components/CommentsSection";
import { EditPostDialog } from "@/components/EditPostDialog";
import { useAuth } from "@/hooks/useAuth";

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  media_urls?: string[] | null;
  location?: string | null;
  event_title?: string | null;
  event_description?: string | null;
  event_date?: string | null;
  event_time?: string | null;
  user_id: string;
  author: {
    name: string;
    avatar: string;
    location: string;
    time: string;
  };
}

interface MobilePostCardProps {
  post: Post;
  onShare: (postId: string) => void;
  onPostUpdated?: () => void;
}

export const MobilePostCard = ({ post, onShare, onPostUpdated }: MobilePostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { isLiked, likesCount, toggleLike, loading: likeLoading } = useLikes(post.id);
  const { user } = useAuth();
  
  const isOwner = user?.id === post.user_id;

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-sm">{post.author.name}</h4>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{post.author.location}</span>
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>{post.author.time}</span>
          </div>
        </div>
        
        {/* Actions menu for post owner */}
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <EditPostDialog 
                  post={post} 
                  onPostUpdated={onPostUpdated || (() => {})} 
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Image placeholder */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="aspect-video bg-muted mx-4 mb-3 rounded-lg">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image</span>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>{likesCount} J'aime</span>
          <span>{post.comments_count} commentaires</span>
          <span>{post.shares_count} partages</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around border-t border-border py-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 ${isLiked ? 'text-red-500' : ''}`}
          onClick={toggleLike}
          disabled={likeLoading}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          J'aime
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Commenter
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => onShare(post.id)}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Partager
        </Button>
      </div>

      {/* Comments Section */}
      <CommentsSection 
        postId={post.id}
        isOpen={showComments}
        onToggle={() => setShowComments(!showComments)}
      />
    </Card>
  );
};