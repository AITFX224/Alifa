import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type AppRole = 'user' | 'artisan' | 'admin';

export const useRoles = () => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery<AppRole[]>({
    queryKey: ["user_roles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [] as AppRole[];
      const { data, error } = await (supabase as any)
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user.id);
      if (error) throw error;
      return ((data as any[]) ?? []).map((r: any) => r.role as AppRole);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60, // 1 min
  });

  const roles: AppRole[] = data ?? [];
  const hasRole = (role: AppRole) => roles.includes(role);

  return { roles, hasRole, isLoading, error, refetch };
};