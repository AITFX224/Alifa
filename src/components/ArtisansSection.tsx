import { useState, useEffect } from "react";
import { Search, MapPin, Star, Phone, Globe, MessageCircle, Filter, SortDesc, Grid, List, Hammer, Award, Clock, Heart, Share } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useArtisans } from "@/hooks/useArtisans";
import { useSearchParams } from "react-router-dom";

interface ArtisansSectionProps {
  onContactArtisan: (artisanName: string) => void;
  onLikeArtisan: (artisanId: string) => void;
  likedArtisans: Set<string>;
}

export const ArtisansSection = ({ onContactArtisan, onLikeArtisan, likedArtisans }: ArtisansSectionProps) => {
  const { toast } = useToast();
  const { artisans: realArtisans, loading } = useArtisans();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Prefill filters from URL params (famille, sous, lieu, q)
  const [searchParams] = useSearchParams();
  const getCategoryIdFromText = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("coiff")) return "coiffure";
    if (t.includes("coutu") || t.includes("mode")) return "couture";
    if (t.includes("menuis")) return "menuiserie";
    if (t.includes("mécan") || t.includes("mecan")) return "mecanique";
    if (t.includes("électr") || t.includes("electr")) return "electricite";
    if (t.includes("plomb")) return "plomberie";
    if (t.includes("bijou")) return "bijouterie";
    if (t.includes("art")) return "art";
    return "all";
  };

  useEffect(() => {
    const famille = searchParams.get("famille") || "";
    const sous = searchParams.get("sous") || "";
    const lieu = searchParams.get("lieu") || "";
    const q = searchParams.get("q") || "";

    if (sous) {
      setSearchQuery(sous);
      setSelectedCategory(getCategoryIdFromText(sous));
    } else if (q) {
      setSearchQuery(q);
    } else if (famille) {
      setSearchQuery(famille);
      setSelectedCategory(getCategoryIdFromText(famille));
    }

    if (lieu) setSelectedLocation(lieu);
    // Run once on load to keep UX simple
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = [
    { id: "all", name: "Tous les métiers", icon: "🔧", count: 1248 },
    { id: "coiffure", name: "Coiffure & Beauté", icon: "✂️", count: 245 },
    { id: "couture", name: "Couture & Mode", icon: "👔", count: 189 },
    { id: "menuiserie", name: "Menuiserie", icon: "🔨", count: 156 },
    { id: "mecanique", name: "Mécanique", icon: "🔧", count: 203 },
    { id: "electricite", name: "Électricité", icon: "⚡", count: 134 },
    { id: "plomberie", name: "Plomberie", icon: "🚿", count: 1 },
    { id: "bijouterie", name: "Bijouterie", icon: "💎", count: 78 },
    { id: "art", name: "Arts & Crafts", icon: "🎨", count: 92 }
  ];

  const locations = [
    { id: "all", name: "Toute la Guinée" },
    { id: "conakry", name: "Conakry" },
    { id: "kindia", name: "Kindia" },
    { id: "kankan", name: "Kankan" },
    { id: "labe", name: "Labé" },
    { id: "mamou", name: "Mamou" },
    { id: "faranah", name: "Faranah" }
  ];

  // Transformer les données réelles d'artisans
  const artisans = realArtisans.map(artisan => ({
    id: artisan.id,
    name: artisan.display_name,
    profession: artisan.profession,
    rating: artisan.rating,
    reviewsCount: artisan.reviews_count,
    completedProjects: artisan.posts_count, // Utiliser posts_count comme proxy pour les projets
    location: artisan.location,
    specialties: artisan.specialties || [],
    verified: artisan.is_verified,
    avatar: artisan.avatar_url || "/placeholder.svg",
    phone: artisan.phone,
    website: artisan.website,
    bio: artisan.bio,
    // Valeurs par défaut pour les champs manquants
    premium: false,
    isOnline: Math.random() > 0.5, // Simulé
    responseTime: "Répond en moins de 2h",
    priceRange: "Prix sur demande",
    coverImage: "/placeholder.svg",
    gallery: ["/placeholder.svg"],
    certifications: ["Artisan qualifié"],
    joinedDate: "Nouveau membre",
    lastActive: "Récemment actif",
    category: (artisan.profession || "").toLowerCase().includes("coiff") ? "coiffure" :
              (artisan.profession || "").toLowerCase().includes("électr") ? "electricite" :
              (artisan.profession || "").toLowerCase().includes("menu") ? "menuiserie" :
              (artisan.profession || "").toLowerCase().includes("coutu") ? "couture" :
              (artisan.profession || "").toLowerCase().includes("mécan") ? "mecanique" :
              (artisan.profession || "").toLowerCase().includes("plomb") ? "plomberie" :
              (artisan.profession || "").toLowerCase().includes("bijou") ? "bijouterie" : "art"
  }));

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || artisan.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || 
                           artisan.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const sortedArtisans = [...filteredArtisans].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviewsCount - a.reviewsCount;
      case "projects":
        return b.completedProjects - a.completedProjects;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleContactArtisan = (artisan: any) => {
    onContactArtisan(artisan.name);
    toast({
      title: "Contact initié",
      description: `Vous pouvez maintenant contacter ${artisan.name}`
    });
  };

  const handleShareArtisan = (artisan: any) => {
    toast({
      title: "Profil partagé",
      description: `Le profil de ${artisan.name} a été partagé`
    });
  };

  const ArtisanCard = ({ artisan, index }: { artisan: any; index: number }) => {
    if (viewMode === "list") {
      return (
        <Card className="card-enhanced hover:shadow-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-2 ring-primary/20">
                  <AvatarImage src={artisan.avatar} />
                  <AvatarFallback className="bg-gradient-brand text-white font-bold text-xl">
                    {artisan.name[0]}
                  </AvatarFallback>
                </Avatar>
                {artisan.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card"></div>
                )}
                {artisan.premium && (
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-brand rounded-full flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-poppins font-bold truncate">{artisan.name}</h3>
                  {artisan.verified && <Star className="w-5 h-5 text-primary fill-primary" />}
                </div>
                
                <p className="text-primary font-semibold text-lg mb-2">{artisan.profession}</p>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{artisan.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-warning fill-warning" />
                    <span className="font-medium">{artisan.rating}</span>
                    <span className="ml-1">({artisan.reviewsCount} avis)</span>
                  </div>
                  <div className="flex items-center">
                    <Hammer className="w-4 h-4 mr-1" />
                    <span>{artisan.completedProjects} projets</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {artisan.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {artisan.responseTime}
                    </p>
                    <p className="text-sm font-medium text-primary">{artisan.priceRange}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLikeArtisan(artisan.id)}
                      className={likedArtisans.has(artisan.id) ? "text-destructive border-destructive" : ""}
                    >
                      <Heart className={`w-4 h-4 ${likedArtisans.has(artisan.id) ? "fill-destructive" : ""}`} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleShareArtisan(artisan)}>
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => handleContactArtisan(artisan)}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="card-enhanced hover:shadow-glow transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {artisan.premium && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-brand text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6 -mt-8 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="relative">
              <Avatar className="w-16 h-16 ring-4 ring-card border-2 border-white">
                <AvatarImage src={artisan.avatar} />
                <AvatarFallback className="bg-gradient-brand text-white font-bold text-lg">
                  {artisan.name[0]}
                </AvatarFallback>
              </Avatar>
              {artisan.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card"></div>
              )}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLikeArtisan(artisan.id)}
              className={likedArtisans.has(artisan.id) ? "text-destructive border-destructive" : ""}
            >
              <Heart className={`w-4 h-4 ${likedArtisans.has(artisan.id) ? "fill-destructive" : ""}`} />
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-poppins font-bold text-lg truncate">{artisan.name}</h3>
            {artisan.verified && <Star className="w-4 h-4 text-primary fill-primary" />}
          </div>
          
          <p className="text-primary font-semibold mb-3">{artisan.profession}</p>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{artisan.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-warning fill-warning" />
              <span className="font-medium">{artisan.rating}</span>
              <span className="text-muted-foreground ml-1">({artisan.reviewsCount})</span>
            </div>
            <div className="text-muted-foreground">
              <Hammer className="w-4 h-4 inline mr-1" />
              {artisan.completedProjects} projets
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {artisan.specialties.slice(0, 2).map((specialty: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              {artisan.responseTime}
            </p>
            <p className="text-sm font-medium text-primary">{artisan.priceRange}</p>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleShareArtisan(artisan)}>
              <Share className="w-4 h-4" />
            </Button>
            <Button size="sm" className="flex-1" onClick={() => handleContactArtisan(artisan)}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-poppins font-bold">Artisans de Guinée</h1>
            <p className="text-muted-foreground text-sm md:text-base">Découvrez les meilleurs artisans qualifiés près de chez vous</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="hidden sm:flex"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="hidden sm:flex"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un artisan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/20 border-border/40 text-sm md:text-base"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40 md:w-48 bg-muted/20 text-sm md:text-base">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id} className="text-sm">
                  <span className="mr-2">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  <span className="text-xs text-muted-foreground ml-1">({category.count})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

           <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-32 md:w-40 bg-muted/20 text-sm md:text-base">
              <SelectValue placeholder="Lieu" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id} className="text-sm">
                  <span className="hidden sm:inline">{location.name}</span>
                  <span className="sm:hidden">{location.name.split(' ')[0]}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32 md:w-40 bg-muted/20 text-sm md:text-base">
              <SelectValue placeholder="Tri" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              <SelectItem value="rating" className="text-sm">Note</SelectItem>
              <SelectItem value="reviews" className="text-sm">Avis</SelectItem>
              <SelectItem value="projects" className="text-sm">Projets</SelectItem>
              <SelectItem value="name" className="text-sm">Nom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories Quick Access */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
        {categories.slice(1).map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className="flex flex-col h-auto p-2 md:p-3 space-y-1"
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="text-base md:text-lg">{category.icon}</span>
            <span className="text-xs font-medium leading-tight text-center">
              {category.name.split(' ')[0]}
            </span>
            <span className="text-xs text-muted-foreground">{category.count}</span>
          </Button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {loading ? "Chargement..." : `${sortedArtisans.length} artisan${sortedArtisans.length > 1 ? 's' : ''} trouvé${sortedArtisans.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="card-enhanced animate-pulse">
              <div className="h-32 bg-muted"></div>
              <CardContent className="p-6 -mt-8 relative">
                <div className="w-16 h-16 bg-muted rounded-full mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Artisans Grid/List */}
      {!loading && (
        <div className={`grid gap-4 md:gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {sortedArtisans.map((artisan, index) => (
            <ArtisanCard key={artisan.id} artisan={artisan} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedArtisans.length === 0 && (
        <Card className="card-enhanced">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun artisan trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedLocation("all");
            }}>
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};