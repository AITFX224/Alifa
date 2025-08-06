import { useState } from "react";
import { Search, TrendingUp, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useArtisans } from "@/hooks/useArtisans";

const filters = [
  { id: "coiffure", name: "Coiffeurs", icon: "✂️", count: 245, trend: "+12%" },
  { id: "couture", name: "Tailleurs", icon: "👔", count: 189, trend: "+8%" },
  { id: "menuiserie", name: "Menuisiers", icon: "🔨", count: 156, trend: "+15%" },
  { id: "mecanique", name: "Mécaniciens", icon: "🔧", count: 203, trend: "+5%" },
  { id: "electricite", name: "Électriciens", icon: "⚡", count: 134, trend: "+18%" },
  { id: "plomberie", name: "Plombiers", icon: "🚿", count: 45, trend: "+22%" }
];

// Les suggestions seront récupérées depuis le hook useArtisans

interface SearchMobileProps {
  onShortcutClick: (filterId: string) => void;
  onFollowArtisan: (artisanName: string) => void;
  followedArtisans: Set<string>;
}

export const SearchMobile = ({ onShortcutClick, onFollowArtisan, followedArtisans }: SearchMobileProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { artisans, loading } = useArtisans();
  
  // Suggestions d'artisans depuis la base de données
  const suggestions = artisans.slice(0, 3).map(artisan => ({
    name: artisan.display_name,
    profession: artisan.profession,
    location: artisan.location,
    rating: artisan.rating,
    mutual: Math.floor(Math.random() * 10) + 1 // Temporaire
  }));

  return (
    <div className="space-y-6 pb-20">
      {/* Search Bar */}
      <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur-md px-4 py-3 -mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Rechercher des artisans, services..." 
            className="pl-12 h-12 text-base bg-muted/30 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins font-semibold text-lg">Accès rapide</h3>
          <TrendingUp className="w-5 h-5 text-success" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {filters.map((filter, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-auto p-4 hover:bg-muted/50 transition-all duration-200 group"
              onClick={() => onShortcutClick(filter.id)}
            >
              <div className="flex flex-col items-center space-y-2 w-full">
                <span className="text-2xl group-hover:animate-bounce-subtle">{filter.icon}</span>
                <div className="text-center">
                  <div className="font-medium text-sm">{filter.name}</div>
                  <div className="text-xs text-muted-foreground">{filter.count} artisans</div>
                  <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0 mt-1">
                    {filter.trend}
                  </Badge>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-4 space-y-4">
        <h3 className="font-poppins font-semibold text-lg">Artisans suggérés</h3>
        
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border border-border/50 animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-brand text-white font-semibold">
                      {suggestion.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold truncate">{suggestion.name}</h4>
                      <Button
                        size="sm"
                        variant={followedArtisans.has(suggestion.name) ? "secondary" : "default"}
                        className="ml-2 shrink-0"
                        onClick={() => onFollowArtisan(suggestion.name)}
                      >
                        {followedArtisans.has(suggestion.name) ? "Suivi" : "Suivre"}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-primary font-medium">{suggestion.profession}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.location}</p>
                    
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-warning fill-warning mr-1" />
                        <span className="text-xs font-medium">{suggestion.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{suggestion.mutual} amis en commun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};