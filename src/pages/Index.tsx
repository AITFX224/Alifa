import { Search, Home, Users, Camera, Bell, MessageCircle, Heart, Share, MoreHorizontal, MapPin, Star, Hammer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const posts = [
    {
      id: 1,
      author: "Fatou Diallo",
      profession: "Coiffeuse",
      location: "Conakry",
      time: "Il y a 2h",
      content: "Nouvelle coiffure tendance ! Qui veut essayer ce style moderne ? 💇‍♀️✨",
      image: "/placeholder.svg",
      likes: 24,
      comments: 8,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      author: "Mamadou Camara",
      profession: "Tailleur",
      location: "Kindia",
      time: "Il y a 4h",
      content: "Costume sur mesure terminé ! Broderies traditionnelles guinéennes. Contactez-moi pour vos commandes 👔",
      image: "/placeholder.svg",
      likes: 18,
      comments: 5,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      author: "Aïssatou Barry",
      profession: "Bijoutière",
      location: "Labé",
      time: "Il y a 6h",
      content: "Nouvelles créations en or ! Bijoux traditionnels avec une touche moderne 💍✨",
      image: "/placeholder.svg",
      likes: 31,
      comments: 12,
      avatar: "/placeholder.svg"
    }
  ];

  const shortcuts = [
    { name: "Coiffeurs", icon: "✂️", count: 245 },
    { name: "Tailleurs", icon: "👔", count: 189 },
    { name: "Menuisiers", icon: "🔨", count: 156 },
    { name: "Mécaniciens", icon: "🔧", count: 203 }
  ];

  const suggestions = [
    { name: "Ibrahim Diallo", profession: "Électricien", location: "Conakry" },
    { name: "Mariama Soumah", profession: "Couturière", location: "Kankan" },
    { name: "Alpha Condé", profession: "Menuisier", location: "Labé" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header à la Facebook */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo et recherche */}
            <div className="flex items-center space-x-4 flex-1">
              <h1 className="text-2xl font-bold text-primary">Zonaya</h1>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Rechercher des artisans..."
                  className="pl-10 bg-muted/50 border-0 w-64"
                />
              </div>
            </div>

            {/* Navigation centrale */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-3">
                <Home className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-3">
                <Users className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-3">
                <Hammer className="w-5 h-5" />
              </Button>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar gauche */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Raccourcis</h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <Button key={index} variant="ghost" className="w-full justify-start p-2">
                      <span className="mr-3 text-lg">{shortcut.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">{shortcut.name}</div>
                        <div className="text-xs text-muted-foreground">{shortcut.count} artisans</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Créer</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start p-2">
                    <Camera className="w-4 h-4 mr-3" />
                    Publier une photo
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-2">
                    <Users className="w-4 h-4 mr-3" />
                    Profil artisan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fil d'actualité central */}
          <div className="col-span-6 space-y-4">
            {/* Créer une publication */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="flex-1 justify-start text-muted-foreground">
                    Que voulez-vous partager, artisan ?
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Photo/Vidéo
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localisation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Publications */}
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-0">
                  {/* En-tête du post */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{post.author}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{post.profession}</span>
                          <span className="mx-1">•</span>
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{post.location}</span>
                          <span className="mx-1">•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Contenu */}
                  <div className="px-4 pb-3">
                    <p>{post.content}</p>
                  </div>

                  {/* Image */}
                  <div className="aspect-video bg-muted"></div>

                  {/* Actions */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{post.likes} mentions J'aime</span>
                      <span>{post.comments} commentaires</span>
                    </div>
                    <div className="flex items-center border-t pt-2">
                      <Button variant="ghost" className="flex-1">
                        <Heart className="w-4 h-4 mr-2" />
                        J'aime
                      </Button>
                      <Button variant="ghost" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Commenter
                      </Button>
                      <Button variant="ghost" className="flex-1">
                        <Share className="w-4 h-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar droite */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Artisans suggérés</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{suggestion.name}</div>
                          <div className="text-xs text-muted-foreground">{suggestion.profession}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Suivre
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Tendances</h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">#CoiffureModerne</div>
                    <div className="text-muted-foreground">45 publications</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">#TailleurGuinéen</div>
                    <div className="text-muted-foreground">32 publications</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">#BijouxAfricains</div>
                    <div className="text-muted-foreground">28 publications</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
