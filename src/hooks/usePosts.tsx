import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  content: string;
  media_urls: string[] | null;
  location: string | null;
  event_title: string | null;
  event_date: string | null;
  event_time: string | null;
  event_description: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
    profession: string | null;
  } | null;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            display_name,
            avatar_url,
            profession
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les publications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          fetchPosts(); // Refresh posts when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { posts, loading, refetch: fetchPosts };
}