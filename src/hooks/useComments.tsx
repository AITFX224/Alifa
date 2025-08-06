import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("post_comments")
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles!inner (
              display_name,
              avatar_url
            )
          `)
          .eq("post_id", postId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching comments:", error);
          setComments([]);
          setCommentsCount(0);
        } else {
          const typedComments = data as Comment[];
          setComments(typedComments);
          setCommentsCount(typedComments.length);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
        setCommentsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    // Set up realtime subscription for comments
    const channel = supabase
      .channel('post-comments-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          // Fetch the new comment with profile data
          supabase
            .from("post_comments")
            .select(`
              id,
              content,
              created_at,
              user_id,
              profiles!inner (
                display_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single()
            .then(({ data, error }) => {
              if (data && !error) {
                const newComment = data as Comment;
                setComments(prev => [...prev, newComment]);
                setCommentsCount(prev => prev + 1);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive",
      });
      return false;
    }

    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Le commentaire ne peut pas être vide",
        variant: "destructive",
      });
      return false;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim()
        });

      if (error) throw error;

      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès",
      });

      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du commentaire",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    comments,
    commentsCount,
    loading,
    submitting,
    addComment
  };
};