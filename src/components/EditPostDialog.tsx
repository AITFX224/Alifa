import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditPostDialogProps {
  post: {
    id: string;
    content: string;
    location?: string | null;
    event_title?: string | null;
    event_description?: string | null;
    event_date?: string | null;
    event_time?: string | null;
  };
  onPostUpdated: () => void;
}

export const EditPostDialog = ({ post, onPostUpdated }: EditPostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: post.content,
    location: post.location || "",
    event_title: post.event_title || "",
    event_description: post.event_description || "",
    event_date: post.event_date || "",
    event_time: post.event_time || ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          content: formData.content,
          location: formData.location || null,
          event_title: formData.event_title || null,
          event_description: formData.event_description || null,
          event_date: formData.event_date || null,
          event_time: formData.event_time || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Publication mise à jour",
        description: "Votre publication a été modifiée avec succès"
      });

      setOpen(false);
      onPostUpdated();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la publication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Modifier la publication
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Que voulez-vous partager ?"
              required
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Où êtes-vous ?"
            />
          </div>

          <div>
            <Label htmlFor="event_title">Titre de l'événement</Label>
            <Input
              id="event_title"
              value={formData.event_title}
              onChange={(e) => handleInputChange("event_title", e.target.value)}
              placeholder="Titre de votre événement"
            />
          </div>

          {formData.event_title && (
            <>
              <div>
                <Label htmlFor="event_description">Description de l'événement</Label>
                <Textarea
                  id="event_description"
                  value={formData.event_description}
                  onChange={(e) => handleInputChange("event_description", e.target.value)}
                  placeholder="Décrivez votre événement..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Date</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleInputChange("event_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="event_time">Heure</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => handleInputChange("event_time", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};