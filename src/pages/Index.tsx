import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Home, Users, Camera, Bell, MessageCircle, Heart, Share, MoreHorizontal, MapPin, Star, Hammer, TrendingUp, Sparkles, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/hooks/usePosts";
import { useFilters } from "@/hooks/useFilters";
import { useArtisans } from "@/hooks/useArtisans";
import { useTrendingTopics } from "@/hooks/useTrendingTopics";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { MessagesPanel } from "@/components/MessagesPanel";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MobilePostCard } from "@/components/MobilePostCard";
import { SearchMobile } from "@/components/SearchMobile";
import { NetworkSection } from "@/components/NetworkSection";
import { ArtisansSection } from "@/components/ArtisansSection";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import Logo from "@/components/Logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditPostDialog } from "@/components/EditPostDialog";
import { useLikes } from "@/hooks/useLikes";
import { CommentsSection } from "@/components/CommentsSection";
import { useRoles } from "@/hooks/useRoles";
import { useAccountMode } from "@/hooks/useAccountMode";
const Index = () => {
  const {
    toast
  } = useToast();
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const {
    posts: realPosts,
    loading: postsLoading,
    refetch
  } = usePosts();
  const {
    filters,
    activeFilter,
    applyFilter,
    filterPosts
  } = useFilters();
  const {
    artisans,
    loading: artisansLoading
  } = useArtisans();
  const {
    trendingTopics,
    loading: trendingLoading
  } = useTrendingTopics();
  const navigate = useNavigate();
  const {
    profile
  } = useCurrentProfile();
  const { hasRole } = useRoles();
  const { isArtisanMode } = useAccountMode();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  const [followedArtisans, setFollowedArtisans] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedArtisans, setLikedArtisans] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSection] = useState("home");
  const [searchParams] = useSearchParams();
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);
  useEffect(() => {
    const section = searchParams.get("section");
    const hasArtisanParams = searchParams.get("famille") || searchParams.get("sous") || searchParams.get("lieu") || searchParams.get("q");
    if (section === "artisans" || hasArtisanParams) {
      setCurrentSection("artisans");
    }
  }, [searchParams]);

  // Lecture de l'état d'abonnement simulé depuis le localStorage
  useEffect(() => {
    setSubscriptionActive(localStorage.getItem('artisan_subscription_active') === 'true');
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'artisan_subscription_active') {
        setSubscriptionActive(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Transform real posts to match the expected format
  const transformedPosts = realPosts.map(post => ({
    id: post.id,
    // Keep as UUID string
    author: post.profiles?.display_name || 'Utilisateur',
    profession: post.profiles?.profession || 'Artisan',
    location: post.location || 'Guinée',
    time: new Date(post.created_at).toLocaleDateString('fr-FR'),
    content: post.content,
    image: post.media_urls?.[0] || "/placeholder.svg",
    likes: post.likes_count,
    comments: post.comments_count,
    shares: post.shares_count,
    avatar: post.profiles?.avatar_url || "/placeholder.svg",
    verified: false,
    profiles: post.profiles,
    user_id: post.user_id,
    event_title: post.event_title,
    event_description: post.event_description,
    event_date: post.event_date,
    event_time: post.event_time
  }));

  // Apply filters to posts
  const posts = filterPosts(transformedPosts);

  // Desktop interactions for a post (likes + comments)
  type DesktopPostInteractionsProps = {
    post: {
      id: string;
      comments: number;
      shares: number;
    };
    onShare: (id: string) => void;
  };
  const DesktopPostInteractions = ({
    post,
    onShare
  }: DesktopPostInteractionsProps) => {
    const {
      isLiked,
      likesCount,
      toggleLike,
      loading
    } = useLikes(post.id);
    const [showComments, setShowComments] = useState(false);
    return <>
      <div className="p-5">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <span className="hover:text-destructive cursor-pointer transition-colors">
              {likesCount} mentions J'aime
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
          <Button variant="ghost" className={`flex-1 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 ${isLiked ? 'text-destructive' : ''}`} onClick={toggleLike} disabled={loading}>
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            J'aime
          </Button>
          <Button variant="ghost" className="flex-1 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => setShowComments(v => !v)}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Commenter
          </Button>
          <Button variant="ghost" className="flex-1 hover:bg-secondary/10 hover:text-secondary transition-all duration-200" onClick={() => onShare(post.id)}>
            <Share className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>
      <CommentsSection postId={post.id} isOpen={showComments} onToggle={() => setShowComments(v => !v)} />
    </>;
  };

  // Suggestions d'artisans depuis la base de données
  const suggestions = artisans.slice(0, 4).map(artisan => ({
    name: artisan.display_name,
    profession: artisan.profession,
    location: artisan.location,
    rating: artisan.rating,
    mutual: Math.floor(Math.random() * 10) + 1 // Temporaire - en attendant la logique des amis communs
  }));
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
      description: isFollowed ? `Vous ne suivez plus ${artisanName}` : `Vous suivez maintenant ${artisanName}`
    });
  };
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };
  const handleSharePost = (postId: string) => {
    toast({
      title: "Publication partagée",
      description: "Le lien de la publication a été copié"
    });
  };
  const handleDeletePost = async (postId: string) => {
    try {
      const {
        error
      } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      toast({
        title: "Publication supprimée",
        description: "Votre publication a été supprimée."
      });
      refetch();
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la publication.",
        variant: "destructive"
      });
    }
  };
  const handleFilterClick = (filterId: string) => {
    applyFilter(filterId);
    const filter = filters.find(f => f.id === filterId);
    toast({
      title: `Filtre appliqué`,
      description: `Affichage: ${filter?.name || filterId}`
    });
  };
  const handleContactArtisan = (artisanName: string) => {
    toast({
      title: "Contact initié",
      description: `Ouverture de la conversation avec ${artisanName}`
    });
  };
  const handleLikeArtisan = (artisanId: string) => {
    const isLiked = likedArtisans.has(artisanId);
    const newLikedArtisans = new Set(likedArtisans);
    if (isLiked) {
      newLikedArtisans.delete(artisanId);
    } else {
      newLikedArtisans.add(artisanId);
    }
    setLikedArtisans(newLikedArtisans);
    toast({
      title: isLiked ? "Like retiré" : "Artisan aimé !",
      description: isLiked ? "Vous n'aimez plus cet artisan" : "Artisan ajouté à vos favoris"
    });
  };
  if (loading || postsLoading || artisansLoading || trendingLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Mobile Navigation */}
      <MobileNavigation currentSection={currentSection} onSectionChange={handleSectionChange} />

      {/* Desktop Header - Hidden on mobile */}
      <header className="glass backdrop-blur-xl border-b border-border/30 sticky top-0 z-50 shadow-large hidden md:block">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo et recherche */}
            <div className="flex items-center space-x-8 flex-1">
              <div className="flex items-center space-x-3">
                <Logo className="h-10" alt="Alifa - Logo" />
              </div>
              
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder="Rechercher des artisans, métiers..." className="pl-12 pr-4 h-12 bg-muted/20 border-border/40 backdrop-blur-sm w-80 focus:bg-card/60 focus:border-primary/40 transition-all duration-300 rounded-xl text-base" />
              </div>
            </div>

            {/* Navigation centrale */}
            <div className="flex items-center space-x-2 bg-muted/20 rounded-xl p-1">
              <Button variant="ghost" size="sm" className={`px-4 py-2 transition-all duration-300 rounded-lg ${currentSection === 'home' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-primary/10 hover:text-primary'}`} onClick={() => handleSectionChange('home')}>
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <Button variant="ghost" size="sm" className={`px-4 py-2 transition-all duration-300 rounded-lg ${currentSection === 'users' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-primary/10 hover:text-primary'}`} onClick={() => handleSectionChange('users')}>
                <Users className="w-4 h-4 mr-2" />
                Réseau
              </Button>
              <Button variant="ghost" size="sm" className={`px-4 py-2 transition-all duration-300 rounded-lg ${currentSection === 'artisans' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-primary/10 hover:text-primary'}`} onClick={() => {
              handleSectionChange('artisans');
              navigate('?section=artisans');
            }}>
                <Hammer className="w-4 h-4 mr-2" />
                <span className="mr-1">Artisans</span>
                {subscriptionActive}
              </Button>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <NotificationsPanel>
                <Button variant="ghost" size="lg" className="relative p-3 hover:bg-primary/10 transition-all duration-300 rounded-xl">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
                </Button>
              </NotificationsPanel>
              
              <MessagesPanel>
                <Button variant="ghost" size="lg" className="p-3 hover:bg-primary/10 transition-all duration-300 rounded-xl">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </MessagesPanel>
              
              <CreatePostDialog onPostCreated={refetch}>
                <Button className="bg-gradient-brand text-white font-semibold px-6 py-3 rounded-xl hover:shadow-glow hover:scale-105 transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Publier
                </Button>
              </CreatePostDialog>
              
              <UserProfileMenu>
                <Avatar className="w-11 h-11 hover-scale cursor-pointer border-3 border-primary/30 shadow-md">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-brand text-white font-bold text-lg">{(profile?.display_name?.[0] || 'U').toUpperCase()}</AvatarFallback>
                </Avatar>
              </UserProfileMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {hasRole('artisan') && isArtisanMode && (
          <Card className="bg-success/5 border border-success/20 rounded-xl mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                  <Hammer className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Mode artisan actif</p>
                  <p className="text-sm text-muted-foreground">Vos outils professionnels sont affichés en priorité.</p>
                </div>
              </div>
              <Badge variant="secondary">Artisan</Badge>
            </CardContent>
          </Card>
        )}
        {/* Mobile Content */}
        <div className="md:hidden safe-area-pt">
          {currentSection === 'search' && <SearchMobile onShortcutClick={handleFilterClick} onFollowArtisan={handleFollowArtisan} followedArtisans={followedArtisans} />}
          
          {currentSection === 'users' && <div className="pb-20 safe-area-pb">
              <NetworkSection onFollowUser={handleFollowArtisan} followedUsers={followedArtisans} />
            </div>}
          
          {currentSection === 'artisans' && <div className="pb-20 safe-area-pb">
              <ArtisansSection onContactArtisan={handleContactArtisan} onLikeArtisan={handleLikeArtisan} likedArtisans={likedArtisans} />
            </div>}
          
          {currentSection === 'home' && <div className="space-y-3 pb-20 safe-area-pb">
              {/* Welcome Message for Mobile */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-xl mx-3">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Bienvenue sur Alifa</h2>
                      <p className="text-xs text-muted-foreground">Découvrez les meilleurs artisans</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Create Post */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl mx-3">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-brand text-white text-sm">{(profile?.display_name?.[0] || 'U').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CreatePostDialog onPostCreated={refetch}>
                      <Button variant="outline" className="flex-1 justify-start text-muted-foreground bg-muted/20 border-dashed h-10 text-sm touch-target">
                        Que voulez-vous partager ?
                      </Button>
                    </CreatePostDialog>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Posts */}
              <div className="px-3 space-y-3">
                {transformedPosts.map((post, index) => <div key={post.id} className="animate-fade-in" style={{
              animationDelay: `${0.1 * index}s`
            }}>
                     <MobilePostCard post={{
                id: post.id,
                // Keep UUID as string
                content: post.content,
                created_at: post.time,
                likes_count: post.likes,
                comments_count: post.comments,
                shares_count: post.shares,
                media_urls: post.image && post.image !== "/placeholder.svg" ? [post.image] : null,
                location: post.location,
                user_id: post.user_id,
                event_title: post.event_title,
                event_description: post.event_description,
                event_date: post.event_date,
                event_time: post.event_time,
                author: {
                  name: post.profiles?.display_name || "Utilisateur anonyme",
                  avatar: post.profiles?.avatar_url || "/placeholder.svg",
                  location: post.location || "Localisation inconnue",
                  time: new Date(post.time).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
              }} onShare={id => handleSharePost(id)} onPostUpdated={refetch} />
                  </div>)}
              </div>
            </div>}
        </div>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden md:block">
          {currentSection === "home" && <div className="grid grid-cols-12 gap-6">
              {/* Sidebar gauche */}
              <div className="col-span-3 space-y-6">
                <Card className="card-enhanced animate-fade-in">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-poppins font-semibold text-lg">Filtres</h3>
                      <TrendingUp className="w-4 h-4 text-success" />
                      {activeFilter !== "all" && <Badge variant="outline" className="text-xs">
                          {filters.find(f => f.id === activeFilter)?.name}
                        </Badge>}
                    </div>
                    <div className="space-y-3">
                      {filters.map((filter, index) => <Button key={index} variant={activeFilter === filter.id ? "default" : "ghost"} className="w-full justify-between p-3 hover:bg-muted/50 transition-all duration-200 group" onClick={() => handleFilterClick(filter.id)}>
                          <div className="flex items-center">
                            <span className="mr-3 text-xl group-hover:animate-bounce-subtle">{filter.icon}</span>
                            <div className="text-left">
                              <div className="font-medium text-sm">{filter.name}</div>
                              <div className="text-xs text-muted-foreground">{filter.count} artisans</div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0">
                            {filter.trend}
                          </Badge>
                        </Button>)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Fil d'actualité central */}
              <div className="col-span-6 space-y-6">
                {/* Créer une publication */}
                <Card className="card-enhanced animate-slide-up">
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-11 h-11">
                        <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={`Avatar de ${profile?.display_name || 'utilisateur'}`} />
                        <AvatarFallback className="bg-gradient-brand text-white">
                          {(profile?.display_name?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <CreatePostDialog onPostCreated={refetch}>
                        <Button variant="outline" className="flex-1 justify-start text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/40 border-dashed transition-all duration-300">
                          Que voulez-vous partager, artisan ?
                        </Button>
                      </CreatePostDialog>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <CreatePostDialog onPostCreated={refetch}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                          <Camera className="w-4 h-4 mr-2" />
                          Photo/Vidéo
                        </Button>
                      </CreatePostDialog>
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary" onClick={() => toast({
                    title: "Localisation",
                    description: "Ajout de localisation..."
                  })}>
                        <MapPin className="w-4 h-4 mr-2" />
                        Localisation
                      </Button>
                      <CreatePostDialog onPostCreated={refetch} startWithEventForm>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Événement
                        </Button>
                      </CreatePostDialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Publications */}
                {posts.map((post, index) => <Card key={post.id} className="card-enhanced animate-fade-in hover:shadow-glow transition-all duration-500" style={{
              animationDelay: `${0.1 * index}s`
            }}>
                    <CardContent className="p-0">
                      {/* En-tête du post */}
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
                              {post.verified && <Sparkles className="w-4 h-4 text-primary fill-primary" />}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              {(subscriptionActive || post.profession !== 'Artisan') && (
                                <>
                                  <span className="font-medium text-primary">{post.profession}</span>
                                  <span className="mx-2">•</span>
                                </>
                              )}
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{post.location}</span>
                              <span className="mx-2">•</span>
                              <span>{post.time}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[180px]">
                            <DropdownMenuItem onClick={() => handleSharePost(post.id.toString())}>
                              Partager
                            </DropdownMenuItem>
                            {user?.id === post.user_id ? <>
                                <DropdownMenuItem asChild>
                                  <EditPostDialog post={{
                            id: post.id,
                            content: post.content,
                            location: post.location,
                            event_title: post.event_title,
                            event_description: post.event_description,
                            event_date: post.event_date,
                            event_time: post.event_time
                          }} onPostUpdated={refetch} />
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeletePost(post.id.toString())}>
                                  Supprimer
                                </DropdownMenuItem>
                              </> : <DropdownMenuItem onClick={() => toast({
                        title: "Signalé",
                        description: "Merci pour votre signalement"
                      })}>
                                Signaler
                              </DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Contenu */}
                      <div className="px-5 pb-4">
                        <p className="leading-relaxed">{post.content}</p>
                      </div>

                      {/* Image */}
                      {post.image && post.image !== "/placeholder.svg" && <div className="aspect-video bg-gradient-to-br from-muted via-muted/50 to-muted/20 relative overflow-hidden">
                          <img src={post.image} alt="Post media" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>}

                      {/* Interactions (likes + commentaires) */}
                      <DesktopPostInteractions post={{
                  id: post.id,
                  comments: post.comments,
                  shares: post.shares
                }} onShare={id => handleSharePost(id)} />
                    </CardContent>
                  </Card>)}
              </div>

              {/* Sidebar droite */}
              <div className="col-span-3 space-y-6">
                <Card className="card-enhanced animate-fade-in" style={{
              animationDelay: '0.2s'
            }}>
                  <CardContent className="p-5">
                    <h3 className="font-poppins font-semibold text-lg mb-4">Artisans suggérés</h3>
                    <div className="space-y-4">
                      {suggestions.map((suggestion, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-all duration-200">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-gradient-brand text-white font-semibold">
                                {suggestion.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm">{suggestion.name}</h4>
                              <p className="text-xs text-primary font-medium">{suggestion.profession}</p>
                              <p className="text-xs text-muted-foreground">{suggestion.location}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-warning fill-warning mr-1" />
                                  <span className="text-xs font-medium">{suggestion.rating}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{suggestion.mutual} amis</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant={followedArtisans.has(suggestion.name) ? "secondary" : "default"} className="text-xs" onClick={() => handleFollowArtisan(suggestion.name)}>
                            {followedArtisans.has(suggestion.name) ? "Suivi" : "Suivre"}
                          </Button>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-enhanced animate-fade-in" style={{
              animationDelay: '0.3s'
            }}>
                  <CardContent className="p-5">
                    <h3 className="font-poppins font-semibold text-lg mb-4">Tendances</h3>
                     <div className="space-y-3">
                       {trendingTopics.map(topic => <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                           <div>
                             <h4 className="font-semibold text-sm text-primary">{topic.hashtag}</h4>
                             <p className="text-xs text-muted-foreground">{topic.posts_count} publications</p>
                           </div>
                           <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0">
                             {topic.growth_percentage}
                           </Badge>
                         </div>)}
                     </div>
                  </CardContent>
                </Card>
              </div>
            </div>}

          {currentSection === "users" && <NetworkSection onFollowUser={handleFollowArtisan} followedUsers={followedArtisans} />}

          {currentSection === "artisans" && <ArtisansSection onContactArtisan={handleContactArtisan} onLikeArtisan={handleLikeArtisan} likedArtisans={likedArtisans} />}
        </div>
      </div>
    </div>;
};
export default Index;