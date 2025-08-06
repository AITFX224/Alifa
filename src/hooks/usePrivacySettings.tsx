import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import type { PrivacySettingsData } from '@/lib/validation';

export const usePrivacySettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettingsData>({
    profile_visibility: 'public',
    activity_status: true,
    data_collection: true,
    personalized_ads: true,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          profile_visibility: data.profile_visibility as 'public' | 'private' | 'friends',
          activity_status: data.activity_status,
          data_collection: data.data_collection,
          personalized_ads: data.personalized_ads,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de confidentialité",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<PrivacySettingsData>) => {
    if (!user) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "Paramètres mis à jour",
        description: "Vos paramètres de confidentialité ont été sauvegardés",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  const exportData = async () => {
    if (!user) return;

    try {
      // Export user data from all relevant tables
      const [profileData, postsData, commentsData, likesData] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('posts').select('*').eq('user_id', user.id),
        supabase.from('post_comments').select('*').eq('user_id', user.id),
        supabase.from('post_likes').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        user_info: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        profile: profileData.data,
        posts: postsData.data,
        comments: commentsData.data,
        likes: likesData.data,
        privacy_settings: settings,
        export_date: new Date().toISOString(),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `alifa_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: "Vos données ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter vos données",
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      // Delete user data in correct order (respecting foreign keys)
      await Promise.all([
        supabase.from('post_likes').delete().eq('user_id', user.id),
        supabase.from('post_comments').delete().eq('user_id', user.id),
      ]);

      await supabase.from('posts').delete().eq('user_id', user.id);
      await supabase.from('privacy_settings').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('user_id', user.id);

      // Finally delete the auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé définitivement",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte. Contactez le support.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
    exportData,
    deleteAccount,
  };
};