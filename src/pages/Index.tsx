import { useState } from "react";
import { Search, Home, Users, Camera, Bell, MessageCircle, Heart, Share, MoreHorizontal, MapPin, Star, Hammer, TrendingUp, Sparkles, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { MessagesPanel } from "@/components/MessagesPanel";
import { UserProfileMenu } from "@/components/UserProfileMenu";

const Index = () => {
  const { toast } = useToast();
  const [followedArtisans, setFollowedArtisans] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [currentSection, setCurrentSection] = useState("home");

  const [posts, setPosts] = useState([
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
      shares: 3,
      avatar: "/placeholder.svg",
      verified: true
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
      shares: 2,
      avatar: "/placeholder.svg",
      verified: false
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
      shares: 7,
      avatar: "/placeholder.svg",
      verified: true
    }
  ]);

  const shortcuts = [
    { name: "Coiffeurs", icon: "✂️", count: 245, trend: "+12%" },
    { name: "Tailleurs", icon: "👔", count: 189, trend: "+8%" },
    { name: "Menuisiers", icon: "🔨", count: 156, trend: "+15%" },
    { name: "Mécaniciens", icon: "🔧", count: 203, trend: "+5%" }
  ];

  const suggestions = [
    { name: "Ibrahim Diallo", profession: "Électricien", location: "Conakry", rating: 4.9, mutual: 5 },
    { name: "Mariama Soumah", profession: "Couturière", location: "Kankan", rating: 4.7, mutual: 3 },
    { name: "Alpha Condé", profession: "Menuisier", location: "Labé", rating: 4.8, mutual: 8 }
  ];

  const trendingTopics = [
    { name: "#CoiffureModerne", posts: 45, growth: "+23%" },
    { name: "#TailleurGuinéen", posts: 32, growth: "+18%" },
    { name: "#BijouxAfricains", posts: 28, growth: "+31%" },
    { name: "#MenuiserieArt", posts: 21, growth: "+12%" }
  ];

  // Fonctions pour gérer les interactions
  const handleLikePost = (postId: number) => {
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);
    
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    
    setLikedPosts(newLikedPosts);
    
    // Mettre à jour le count des likes
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + (isLiked ? -1 : 1) }
        : post
    ));

    toast({
      title: isLiked ? "Like retiré" : "Publication aimée !",
      description: isLiked ? "Vous n'aimez plus cette publication" : "Votre like a été ajouté",
    });
  };

  const handleFollowArtisan = (artisanName: string) => {
    const isFollowed = followedArtisans.has(artisanName);
    const newFollowed = new Set(followedArtisans);
    
    if (isFollowed) {
      newFollowed.delete(artisanName);
    } else {
      newFollowed.add(artisanName);
    }
    
    setFollowedArtisans(newFollowed);
    
    toast({
      title: isFollowed ? "Ne plus suivre" : "Suivi !",
      description: isFollowed 
        ? `Vous ne suivez plus ${artisanName}` 
        : `Vous suivez maintenant ${artisanName}`,
    });
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    toast({
      title: "Navigation",
      description: `Section ${section} sélectionnée`,
    });
  };

  const handleSharePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
    
    toast({
      title: "Publication partagée !",
      description: "Le contenu a été partagé avec vos contacts",
    });
  };

  const handleCommentPost = (postId: number) => {
    toast({
      title: "Commentaires",
      description: "Ouverture de la section commentaires...",
    });
  };

  const handleShortcutClick = (shortcutName: string) => {
    toast({
      title: `${shortcutName} sélectionnés`,
      description: `Affichage de tous les ${shortcutName.toLowerCase()}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo et recherche */}
            <div className="flex items-center space-x-6 flex-1">
              <h1 className="text-2xl font-poppins font-bold bg-gradient-brand bg-clip-text text-transparent">
                Zonaya
              </h1>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Rechercher des artisans..."
                  className="pl-10 bg-muted/30 border-border/50 backdrop-blur-sm w-72 focus:bg-card/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Navigation centrale */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 ${currentSection === 'home' ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => handleSectionChange('home')}
              >
                <Home className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 ${currentSection === 'users' ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => handleSectionChange('users')}
              >
                <Users className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 ${currentSection === 'artisans' ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => handleSectionChange('artisans')}
              >
                <Hammer className="w-5 h-5" />
              </Button>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <NotificationsPanel>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/10 transition-all duration-200">
                  <Bell className="w-5 h-5" />
                </Button>
              </NotificationsPanel>
              
              <MessagesPanel>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/10 transition-all duration-200">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </MessagesPanel>
              
              <CreatePostDialog>
                <Button className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Publier
                </Button>
              </CreatePostDialog>
              
              <UserProfileMenu>
                <Avatar className="w-9 h-9 hover-scale cursor-pointer border-2 border-primary/20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-brand text-white font-semibold">U</AvatarFallback>
                </Avatar>
              </UserProfileMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar gauche améliorée */}
          <div className="col-span-3 space-y-6">
            <Card className="card-enhanced animate-fade-in">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-semibold text-lg">Raccourcis</h3>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <Button 
                      key={index} 
                      variant="ghost" 
                      className="w-full justify-between p-3 hover:bg-muted/50 transition-all duration-200 group"
                      onClick={() => handleShortcutClick(shortcut.name)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-xl group-hover:animate-bounce-subtle">{shortcut.icon}</span>
                        <div className="text-left">
                          <div className="font-medium text-sm">{shortcut.name}</div>
                          <div className="text-xs text-muted-foreground">{shortcut.count} artisans</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0">
                        {shortcut.trend}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-5">
                <h3 className="font-poppins font-semibold text-lg mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <CreatePostDialog>
                    <Button variant="outline" className="w-full justify-start p-3 hover-lift border-dashed border-primary/30 hover:border-primary/60">
                      <Camera className="w-4 h-4 mr-3 text-primary" />
                      Publier une photo
                    </Button>
                  </CreatePostDialog>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-3 hover-lift border-dashed border-primary/30 hover:border-primary/60"
                    onClick={() => toast({ title: "Profil artisan", description: "Création de profil artisan..." })}
                  >
                    <Users className="w-4 h-4 mr-3 text-primary" />
                    Créer profil artisan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fil d'actualité central amélioré */}
          <div className="col-span-6 space-y-6">
            {/* Créer une publication améliorée */}
            <Card className="card-enhanced animate-slide-up">
              <CardContent className="p-5">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-brand text-white">V</AvatarFallback>
                  </Avatar>
                  <CreatePostDialog>
                    <Button 
                      variant="outline" 
                      className="flex-1 justify-start text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/40 border-dashed transition-all duration-300"
                    >
                      Que voulez-vous partager, artisan ?
                    </Button>
                  </CreatePostDialog>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <CreatePostDialog>
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                      <Camera className="w-4 h-4 mr-2" />
                      Photo/Vidéo
                    </Button>
                  </CreatePostDialog>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-primary/10 hover:text-primary"
                    onClick={() => toast({ title: "Localisation", description: "Ajout de localisation..." })}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Localisation
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-primary/10 hover:text-primary"
                    onClick={() => toast({ title: "Événement", description: "Création d'événement..." })}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Événement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Publications améliorées */}
            {posts.map((post, index) => (
              <Card key={post.id} className="card-enhanced animate-fade-in hover:shadow-glow transition-all duration-500" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-0">
                  {/* En-tête du post amélioré */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-11 h-11 ring-2 ring-primary/20">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-gradient-brand text-white font-semibold">
                          {post.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-poppins font-semibold">{post.author}</h4>
                          {post.verified && (
                            <Sparkles className="w-4 h-4 text-primary fill-primary" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="font-medium text-primary">{post.profession}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{post.location}</span>
                          <span className="mx-2">•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Contenu */}
                  <div className="px-5 pb-4">
                    <p className="leading-relaxed">{post.content}</p>
                  </div>

                  {/* Image avec effet */}
                  <div className="aspect-video bg-gradient-to-br from-muted via-muted/50 to-muted/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Actions améliorées */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="hover:text-destructive cursor-pointer transition-colors">
                          {post.likes} mentions J'aime
                        </span>
                        <span className="hover:text-primary cursor-pointer transition-colors">
                          {post.comments} commentaires
                        </span>
                        <span className="hover:text-secondary cursor-pointer transition-colors">
                          {post.shares} partages
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center border-t border-border/50 pt-3">
                      <Button 
                        variant="ghost" 
                        className={`flex-1 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 ${likedPosts.has(post.id) ? 'text-destructive bg-destructive/10' : ''}`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${likedPosts.has(post.id) ? 'fill-destructive' : ''}`} />
                        J'aime
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        onClick={() => handleCommentPost(post.id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Commenter
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1 hover:bg-secondary/10 hover:text-secondary transition-all duration-200"
                        onClick={() => handleSharePost(post.id)}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar droite améliorée */}
          <div className="col-span-3 space-y-6">
            <Card className="card-enhanced animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-5">
                <h3 className="font-poppins font-semibold text-lg mb-4">Artisans suggérés</h3>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-gradient-brand text-white font-semibold">
                            {suggestion.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{suggestion.name}</div>
                          <div className="text-xs text-primary font-medium">{suggestion.profession}</div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{suggestion.rating}</span>
                            <span>• {suggestion.mutual} amis communs</span>
                          </div>
                         </div>
                       </div>
                       <Button 
                         size="sm" 
                         variant={followedArtisans.has(suggestion.name) ? "default" : "outline"} 
                         className="hover-scale"
                         onClick={() => handleFollowArtisan(suggestion.name)}
                       >
                         {followedArtisans.has(suggestion.name) ? "Suivi" : "Suivre"}
                       </Button>
                     </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-semibold text-lg">Tendances</h3>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-sm text-primary">{topic.name}</div>
                        <Badge variant="secondary" className="bg-success/10 text-success border-0 text-xs">
                          {topic.growth}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {topic.posts} publications
                      </div>
                    </div>
                  ))}
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
