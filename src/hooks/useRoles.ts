import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type AppRole = 'user' | 'artisan' | 'admin';

export const useRoles = () => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery<{ role: AppRole }[] | undefined>({
    queryKey: ["user_roles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      if (error) throw error;
      return data as { role: AppRole }[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60, // 1 min
  });

  const roles: AppRole[] = (data ?? []).map((r) => r.role);
  const hasRole = (role: AppRole) => roles.includes(role);

  return { roles, hasRole, isLoading, error, refetch };
};