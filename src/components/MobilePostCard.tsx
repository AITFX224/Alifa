import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: number;
  author: string;
  profession: string;
  location: string;
  time: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  avatar: string;
  verified: boolean;
}

interface MobilePostCardProps {
  post: Post;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export const MobilePostCard = ({ post, isLiked, onLike, onComment, onShare }: MobilePostCardProps) => {
  return (
    <Card className="bg-card border-border/30 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={post.avatar} />
              <AvatarFallback className="bg-gradient-brand text-white font-semibold">
                {post.author[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-poppins font-semibold text-base">{post.author}</h4>
                {post.verified && <Sparkles className="w-4 h-4 text-primary fill-primary" />}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="font-medium text-primary">{post.profession}</span>
                <span className="mx-2">•</span>
                <MapPin className="w-3 h-3 mr-1" />
                <span>{post.location}</span>
              </div>
              <span className="text-xs text-muted-foreground">{post.time}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="leading-relaxed text-base">{post.content}</p>
        </div>

        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-muted via-muted/50 to-muted/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Stats */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="hover:text-destructive cursor-pointer transition-colors">
                {post.likes} j'aime
              </span>
              <span className="hover:text-primary cursor-pointer transition-colors">
                {post.comments} commentaires
              </span>
            </div>
            <span className="hover:text-secondary cursor-pointer transition-colors">
              {post.shares} partages
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 border-t border-border/30 pt-3">
          <div className="flex items-center justify-around">
            <Button 
              variant="ghost" 
              className={`flex-1 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 ${
                isLiked ? 'text-destructive bg-destructive/10' : ''
              }`}
              onClick={onLike}
            >
              <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-destructive' : ''}`} />
              J'aime
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={onComment}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Commenter
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 hover:bg-secondary/10 hover:text-secondary transition-all duration-200"
              onClick={onShare}
            >
              <Share className="w-5 h-5 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};