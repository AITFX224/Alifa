import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useLikes = (postId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // Get total likes count
        const { count: totalLikes } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        setLikesCount(totalLikes || 0);

        // Check if user has liked this post
        if (user) {
          const { data: userLike } = await supabase
            .from("post_likes")
            .select("*")
            .eq("post_id", postId)
            .eq("user_id", user.id)
            .single();

          setIsLiked(!!userLike);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();

    // Set up realtime subscription for likes
    const channel = supabase
      .channel('post-likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLikesCount(prev => prev + 1);
            if (payload.new.user_id === user?.id) {
              setIsLiked(true);
            }
          } else if (payload.eventType === 'DELETE') {
            setLikesCount(prev => prev - 1);
            if (payload.old.user_id === user?.id) {
              setIsLiked(false);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour aimer une publication",
        variant: "destructive",
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("post_likes")
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du like",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likesCount,
    toggleLike,
    loading
  };
};