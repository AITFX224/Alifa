import { useState } from "react";
import { Camera, MapPin, Sparkles, X, Image as ImageIcon, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  children: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const { toast } = useToast();

  const handlePost = () => {
    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez écrire quelque chose avant de publier.",
        variant: "destructive"
      });
      return;
    }

    // Simuler la publication
    toast({
      title: "Publication créée !",
      description: "Votre publication a été partagée avec succès.",
    });

    // Reset form
    setContent("");
    setSelectedLocation("");
    setAttachments([]);
    setOpen(false);
  };

  const addLocation = () => {
    setSelectedLocation("Conakry, Guinée");
    toast({
      title: "Localisation ajoutée",
      description: "Conakry, Guinée",
    });
  };

  const addMedia = (type: 'photo' | 'video') => {
    const newAttachment = type === 'photo' ? 'photo.jpg' : 'video.mp4';
    setAttachments([...attachments, newAttachment]);
    toast({
      title: `${type === 'photo' ? 'Photo' : 'Vidéo'} ajoutée`,
      description: `${type === 'photo' ? 'Photo' : 'Vidéo'} prête à être publiée`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 bg-card/95 backdrop-blur-md border border-border/50">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-poppins font-semibold">Créer une publication</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 space-y-4">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-11 h-11">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-brand text-white">U</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">Utilisateur</h4>
              <p className="text-sm text-muted-foreground">Visible par tout le monde</p>
            </div>
          </div>

          {/* Content */}
          <Textarea
            placeholder="Que voulez-vous partager ?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] border-0 bg-muted/20 resize-none text-base"
          />

          {/* Location badge */}
          {selectedLocation && (
            <Badge variant="secondary" className="w-fit">
              <MapPin className="w-3 h-3 mr-1" />
              {selectedLocation}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2 hover:bg-transparent"
                onClick={() => setSelectedLocation("")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-2">
                  {attachment.includes('photo') ? (
                    <ImageIcon className="w-3 h-3" />
                  ) : (
                    <Video className="w-3 h-3" />
                  )}
                  {attachment}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="border border-border/50 rounded-lg p-3">
            <p className="text-sm font-medium mb-3">Ajouter à votre publication</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addMedia('photo')}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addMedia('video')}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Video className="w-4 h-4 mr-2" />
                Vidéo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={addLocation}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Lieu
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Événement
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4">
          <Button 
            onClick={handlePost}
            className="w-full btn-gradient"
            disabled={!content.trim()}
          >
            Publier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}