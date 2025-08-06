import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";
import { useComments, Comment } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { sanitizeContent, rateLimiter } from "@/lib/security";
import { commentSchema } from "@/lib/validation";

interface CommentsSectionProps {
  postId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const CommentsSection = ({ postId, isOpen, onToggle }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const { comments, commentsCount, loading, submitting, addComment } = useComments(postId);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Rate limiting
    if (!rateLimiter.isAllowed(`comment_${user.id}`, 10, 60000)) {
      return;
    }

    // Validate comment
    try {
      commentSchema.parse({ content: newComment.trim() });
    } catch (error) {
      return;
    }

    const sanitizedComment = sanitizeContent(newComment);
    const success = await addComment(sanitizedComment);
    if (success) {
      setNewComment("");
    }
  };

  return (
    <div className="border-t border-border">
      <Button
        variant="ghost"
        className="w-full justify-start p-4 h-auto"
        onClick={onToggle}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        <span className="text-sm text-muted-foreground">
          {commentsCount > 0 ? `${commentsCount} commentaire${commentsCount > 1 ? 's' : ''}` : 'Ajouter un commentaire'}
        </span>
      </Button>

      {isOpen && (
        <div className="p-4 border-t border-border">
          {/* Comment form */}
          {user && (
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.user_metadata?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Écrivez votre commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none min-h-[80px]"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={!newComment.trim() || submitting}
                    className="ml-auto"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {submitting ? "Envoi..." : "Publier"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Comments list */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-4">
                Chargement des commentaires...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                Aucun commentaire pour le moment
              </div>
            ) : (
              comments.map((comment: Comment) => (
                <Card key={comment.id} className="p-3">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                      <AvatarFallback>
                        {comment.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.profiles?.display_name || 'Utilisateur anonyme'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};