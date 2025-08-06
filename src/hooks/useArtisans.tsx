import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Artisan {
  id: string;
  display_name: string;
  profession: string;
  location: string;
  rating: number;
  reviews_count: number;
  specialties: string[];
  years_experience: number;
  is_verified: boolean;
  is_active: boolean;
  followers_count: number;
  posts_count: number;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  website?: string;
}

export function useArtisans() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .not('profession', 'is', null)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des artisans:', error);
        return;
      }

      const transformedData = data?.map(profile => ({
        id: profile.id,
        display_name: profile.display_name || 'Artisan',
        profession: profile.profession || '',
        location: profile.location || '',
        rating: Number(profile.rating) || 0,
        reviews_count: profile.reviews_count || 0,
        specialties: profile.specialties || [],
        years_experience: profile.years_experience || 0,
        is_verified: profile.is_verified || false,
        is_active: profile.is_active || true,
        followers_count: profile.followers_count || 0,
        posts_count: profile.posts_count || 0,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        phone: profile.phone,
        website: profile.website
      })) || [];

      setArtisans(transformedData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('artisans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => fetchArtisans()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    artisans,
    loading,
    refetch: fetchArtisans
  };
}