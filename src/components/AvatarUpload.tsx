import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  displayName: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
  isEditing: boolean;
}

export const AvatarUpload = ({ currentAvatarUrl, displayName, onAvatarUpdate, isEditing }: AvatarUploadProps) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur", 
        description: "L'image doit faire moins de 5MB",
        variant: "destructive"
      });
      return;
    }

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!user?.id || !preview) return;

    setUploading(true);
    try {
      // Convertir le preview en blob
      const response = await fetch(preview);
      const blob = await response.blob();
      
      // Créer un nom de fichier unique
      const fileExt = blob.type.split('/')[1];
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Supprimer l'ancien avatar s'il existe
      if (currentAvatarUrl) {
        const oldFileName = currentAvatarUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      // Upload du nouveau fichier
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      onAvatarUpdate(data.publicUrl);
      setOpen(false);
      setPreview(null);

      toast({
        title: "Photo de profil mise à jour",
        description: "Votre avatar a été changé avec succès"
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la photo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Avatar className="w-32 h-32 ring-4 ring-primary/20">
        <AvatarImage src={currentAvatarUrl || "/placeholder.svg"} />
        <AvatarFallback className="bg-gradient-brand text-white text-2xl font-bold">
          {displayName?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      
      {isEditing && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Changer la photo de profil
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {preview ? (
                <div className="flex flex-col items-center space-y-4">
                  <img 
                    src={preview} 
                    alt="Aperçu" 
                    className="w-32 h-32 object-cover rounded-full"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleUpload} 
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Téléchargement..." : "Confirmer"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={uploading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button asChild className="flex items-center gap-2">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Choisir une photo
                    </label>
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    JPG, PNG ou GIF<br />
                    Taille maximale: 5MB
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};