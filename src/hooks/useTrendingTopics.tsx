import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TrendingTopic {
  id: string;
  title: string;
  hashtag: string;
  posts_count: number;
  growth_percentage: string;
  category?: string;
  is_active: boolean;
}

export function useTrendingTopics() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrendingTopics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trending_topics')
        .select('*')
        .eq('is_active', true)
        .order('posts_count', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur lors de la récupération des tendances:', error);
        return;
      }

      setTrendingTopics(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('trending-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trending_topics'
        },
        () => fetchTrendingTopics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    trendingTopics,
    loading,
    refetch: fetchTrendingTopics
  };
}