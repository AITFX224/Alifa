import { useState, useRef } from "react";
import { Camera, MapPin, Sparkles, X, Image as ImageIcon, Video, Upload, Calendar, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeContent, validateFileType, validateFileSize, validateFileSignature, sanitizeFilename, rateLimiter } from "@/lib/security";
import { createPostSchema, type CreatePostData } from "@/lib/validation";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";

interface CreatePostDialogProps {
  children: React.ReactNode;
  onPostCreated?: () => void;
  startWithEventForm?: boolean;
}

interface MediaFile {
  file: File;
  url: string;
  type: 'image' | 'video';
}

interface Event {
  title: string;
  date: string;
  time: string;
  description: string;
}

export function CreatePostDialog({ children, onPostCreated, startWithEventForm }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { profile } = useCurrentProfile();

  const handlePost = async () => {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier.",
        variant: "destructive"
      });
      return;
    }

    // Rate limiting
    if (!rateLimiter.isAllowed(`create_post_${user.id}`, 5, 60000)) {
      toast({
        title: "Trop de tentatives",
        description: "Veuillez attendre avant de publier à nouveau",
        variant: "destructive",
      });
      return;
    }

    // Validate input data
    try {
      const postData: CreatePostData = {
        content: content.trim(),
        event_title: event?.title?.trim() || undefined,
        event_description: event?.description?.trim() || undefined,
        location: selectedLocation?.trim() || undefined,
        event_date: event?.date || undefined,
        event_time: event?.time || undefined,
      };

      createPostSchema.parse(postData);
    } catch (error) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez vérifier vos données",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() && mediaFiles.length === 0 && !event) {
      toast({
        title: "Erreur",
        description: "Veuillez écrire quelque chose, ajouter des médias ou un événement avant de publier.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {

      // Validate all files before upload
      for (const media of mediaFiles) {
        if (!validateFileType(media.file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi'])) {
          throw new Error(`Type de fichier non supporté: ${media.file.name}`);
        }
        if (!validateFileSize(media.file, 10)) {
          throw new Error(`Fichier trop volumineux: ${media.file.name}`);
        }
        if (media.type === 'image') {
          const isValidSignature = await validateFileSignature(media.file);
          if (!isValidSignature) {
            throw new Error(`Fichier corrompu ou non valide: ${media.file.name}`);
          }
        }
      }

      // Upload media files to Supabase Storage
      const uploadedMediaUrls = [];
      for (const media of mediaFiles) {
        const sanitizedName = sanitizeFilename(media.file.name);
        const fileName = `${Date.now()}_${sanitizedName}`;
        const { data, error } = await supabase.storage
          .from('posts-media')
          .upload(fileName, media.file);

        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('posts-media')
          .getPublicUrl(fileName);
        
        uploadedMediaUrls.push(publicUrl);
      }

      // Sanitize content before saving
      const sanitizedContent = sanitizeContent(content);
      const sanitizedEventTitle = event?.title ? sanitizeContent(event.title) : null;
      const sanitizedEventDescription = event?.description ? sanitizeContent(event.description) : null;

      // Create post in database
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: sanitizedContent,
          media_urls: uploadedMediaUrls.length > 0 ? uploadedMediaUrls : null,
          location: selectedLocation || null,
          event_title: sanitizedEventTitle,
          event_date: event?.date || null,
          event_time: event?.time || null,
          event_description: sanitizedEventDescription
        });

      if (postError) throw postError;

      toast({
        title: "Publication créée !",
        description: `Votre publication a été partagée avec succès${uploadedMediaUrls.length > 0 ? ` avec ${uploadedMediaUrls.length} fichier(s)` : ''}.`,
      });

      // Notifier le parent pour rafraîchir la liste
      onPostCreated?.();

      // Reset form
      setContent("");
      setSelectedLocation("");
      setLocationSearch("");
      setShowLocationSearch(false);
      setMediaFiles([]);
      setEvent(null);
      setShowEventForm(false);
      setOpen(false);
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la publication. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const locations = [
    "Conakry, Guinée", "Kindia, Guinée", "Labé, Guinée", "Kankan, Guinée", 
    "N'Zérékoré, Guinée", "Mamou, Guinée", "Boké, Guinée", "Faranah, Guinée"
  ];

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const addLocation = () => {
    setShowLocationSearch(true);
  };

  const selectLocation = (location: string) => {
    setSelectedLocation(location);
    setShowLocationSearch(false);
    setLocationSearch("");
    toast({
      title: "Localisation ajoutée",
      description: location,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner des images ou des vidéos.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximum est de 10MB.",
          variant: "destructive"
        });
        return;
      }

      const url = URL.createObjectURL(file);
      const newMedia: MediaFile = {
        file,
        url,
        type: isImage ? 'image' : 'video'
      };
      
      setMediaFiles(prev => [...prev, newMedia]);
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url); // Clean up object URL
      updated.splice(index, 1);
      return updated;
    });
  };

  const addMedia = (type: 'photo' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'photo' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  };

  const handleCreateEvent = () => {
    setShowEventForm(true);
  };

  const saveEvent = (eventData: Event) => {
    setEvent(eventData);
    setShowEventForm(false);
    toast({
      title: "Événement ajouté",
      description: `${eventData.title} le ${eventData.date}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v && startWithEventForm) setShowEventForm(true); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 bg-card/95 backdrop-blur-md border border-border/50 flex flex-col max-h-[85vh]">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-poppins font-semibold">Créer une publication</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Partagez votre travail, vos créations ou vos services avec la communauté Alifa
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 space-y-4 flex-1 overflow-y-auto">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-11 h-11">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={`Avatar de ${profile?.display_name || 'utilisateur'}`} />
              <AvatarFallback className="bg-gradient-brand text-white">
                {(profile?.display_name?.[0] || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{profile?.display_name || "Utilisateur"}</h4>
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

          {/* Input file caché */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
          />

          {/* Location search */}
          {showLocationSearch && (
            <Card className="border border-border/50">
              <CardContent className="p-4">
                <Label htmlFor="location-search">Rechercher une localisation</Label>
                <Input
                  id="location-search"
                  placeholder="Tapez pour rechercher..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="mt-2"
                />
                <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                  {filteredLocations.map((location, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => selectLocation(location)}
                    >
                      <MapPin className="w-3 h-3 mr-2" />
                      {location}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setShowLocationSearch(false)}
                >
                  Annuler
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Event form */}
          {showEventForm && (
            <Card className="border border-border/50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-4">Créer un événement</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Titre de l'événement</Label>
                    <Input
                      id="event-title"
                      placeholder="Nom de l'événement"
                      value={event?.title || ""}
                      onChange={(e) => setEvent(prev => ({ ...prev!, title: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={event?.date || ""}
                        onChange={(e) => setEvent(prev => ({ ...prev!, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-time">Heure</Label>
                      <Input
                        id="event-time"
                        type="time"
                        value={event?.time || ""}
                        onChange={(e) => setEvent(prev => ({ ...prev!, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Description de l'événement"
                      value={event?.description || ""}
                      onChange={(e) => setEvent(prev => ({ ...prev!, description: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => saveEvent({
                        title: event?.title || "",
                        date: event?.date || "",
                        time: event?.time || "",
                        description: event?.description || ""
                      })}
                      disabled={!event?.title || !event?.date}
                      className="flex-1"
                    >
                      Ajouter l'événement
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEventForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Media files preview */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {mediaFiles.map((media, index) => (
                <div key={index} className="relative group">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-border/50"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-32 object-cover rounded-lg border border-border/50"
                      controls
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => removeMedia(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <Badge
                    variant="secondary"
                    className="absolute bottom-2 left-2 text-xs"
                  >
                    {media.type === 'image' ? 'Photo' : 'Vidéo'}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Event preview */}
          {event && (
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">Événement</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => setEvent(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <h4 className="font-semibold">{event.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                  )}
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <div className="border border-border/50 rounded-lg p-3">
            <p className="text-sm font-medium mb-3">Ajouter à votre publication</p>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addMedia('photo')}
                className="hover:bg-primary/10 hover:text-primary"
                disabled={uploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addMedia('video')}
                className="hover:bg-primary/10 hover:text-primary"
                disabled={uploading}
              >
                <Video className="w-4 h-4 mr-2" />
                Vidéo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={addLocation}
                className="hover:bg-primary/10 hover:text-primary"
                disabled={uploading}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Lieu
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateEvent}
                className="hover:bg-primary/10 hover:text-primary"
                disabled={uploading}
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
            disabled={(!content.trim() && mediaFiles.length === 0 && !event) || uploading}
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Publication en cours...
              </>
            ) : (
              'Publier'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}