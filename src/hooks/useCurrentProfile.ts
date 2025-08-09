import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CurrentProfile {
  display_name: string | null;
  avatar_url: string | null;
}

export const useCurrentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CurrentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('user_id', user.id)
          .maybeSingle();
        if (!error) {
          setProfile({
            display_name: data?.display_name ?? user.user_metadata?.display_name ?? user.email ?? null,
            avatar_url: data?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
          });
        } else {
          setProfile({
            display_name: user.user_metadata?.display_name ?? user.email ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
          });
        }
      } catch (e) {
        setProfile({
          display_name: user?.user_metadata?.display_name ?? user?.email ?? null,
          avatar_url: user?.user_metadata?.avatar_url ?? null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
};
