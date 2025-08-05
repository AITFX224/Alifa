import { useState } from "react";
import { Search, Users, MapPin, Star, MessageCircle, UserPlus, Filter, TrendingUp, Clock, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface NetworkSectionProps {
  onFollowUser: (userName: string) => void;
  followedUsers: Set<string>;
}

export const NetworkSection = ({ onFollowUser, followedUsers }: NetworkSectionProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("suggestions");

  const suggestions = [
    {
      name: "Fatou Diallo",
      profession: "Coiffeuse Expert",
      location: "Conakry",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviewsCount: 147,
      mutualConnections: 8,
      isOnline: true,
      recentActivity: "Posté il y a 2h",
      specialties: ["Coiffure moderne", "Tresses", "Soins capillaires"],
      verified: true
    },
    {
      name: "Ibrahim Diallo",
      profession: "Électricien Certifié",
      location: "Kindia",
      avatar: "/placeholder.svg",
      rating: 4.8,
      reviewsCount: 89,
      mutualConnections: 5,
      isOnline: false,
      recentActivity: "Actif il y a 1h",
      specialties: ["Installation", "Dépannage", "Maintenance"],
      verified: true
    },
    {
      name: "Mariama Soumah",
      profession: "Couturière Traditional",
      location: "Kankan",
      avatar: "/placeholder.svg",
      rating: 4.7,
      reviewsCount: 156,
      mutualConnections: 12,
      isOnline: true,
      recentActivity: "En ligne maintenant",
      specialties: ["Robes traditional", "Costumes", "Retouches"],
      verified: false
    },
    {
      name: "Alpha Condé",
      profession: "Menuisier Artisan",
      location: "Labé",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviewsCount: 203,
      mutualConnections: 3,
      isOnline: true,
      recentActivity: "Posté il y a 45min",
      specialties: ["Meubles sur mesure", "Rénovation", "Design"],
      verified: true
    },
    {
      name: "Aïssatou Barry",
      profession: "Bijoutière",
      location: "Labé",
      avatar: "/placeholder.svg",
      rating: 4.8,
      reviewsCount: 91,
      mutualConnections: 7,
      isOnline: false,
      recentActivity: "Actif il y a 3h",
      specialties: ["Bijoux en or", "Créations artisanales", "Réparations"],
      verified: true
    }
  ];

  const myConnections = [
    {
      name: "Mamadou Camara",
      profession: "Tailleur",
      location: "Conakry",
      avatar: "/placeholder.svg",
      lastMessage: "Merci pour votre commande !",
      lastActive: "Il y a 5min",
      isOnline: true,
      connectionDate: "Connecté depuis 2 mois"
    },
    {
      name: "Khadija Touré",
      profession: "Esthéticienne",
      location: "Kindia",
      avatar: "/placeholder.svg",
      lastMessage: "À bientôt pour votre prochain rdv",
      lastActive: "Il y a 1h",
      isOnline: false,
      connectionDate: "Connecté depuis 1 mois"
    }
  ];

  const recentActivity = [
    {
      user: "Fatou Diallo",
      action: "a publié une nouvelle création",
      time: "Il y a 30min",
      avatar: "/placeholder.svg"
    },
    {
      user: "Ibrahim Diallo",
      action: "a rejoint un nouveau projet",
      time: "Il y a 1h",
      avatar: "/placeholder.svg"
    },
    {
      user: "Mariama Soumah",
      action: "a reçu 5 nouvelles évaluations",
      time: "Il y a 2h",
      avatar: "/placeholder.svg"
    }
  ];

  const handleMessageUser = (userName: string) => {
    toast({
      title: "Message envoyé",
      description: `Ouverture de la conversation avec ${userName}`
    });
  };

  const filteredSuggestions = suggestions.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-poppins font-bold">Mon Réseau</h1>
            <p className="text-muted-foreground">Découvrez et connectez-vous avec des artisans talentueux</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tendances
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher dans votre réseau..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/20 border-border/40"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Connexions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Nouvelles cette semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Messages non lus</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Heart className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Interactions aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="connections">Mes Connexions</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuggestions.map((user, index) => (
              <Card key={index} className="card-enhanced hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-brand text-white font-bold text-lg">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-poppins font-semibold truncate">{user.name}</h3>
                        {user.verified && <Star className="w-4 h-4 text-primary fill-primary" />}
                      </div>
                      
                      <p className="text-primary font-medium text-sm mb-1">{user.profession}</p>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{user.location}</span>
                        <span className="mx-2">•</span>
                        <Star className="w-3 h-3 mr-1 text-warning fill-warning" />
                        <span>{user.rating} ({user.reviewsCount})</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {user.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {user.recentActivity}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMessageUser(user.name)}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant={followedUsers.has(user.name) ? "secondary" : "default"}
                            onClick={() => onFollowUser(user.name)}
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            {followedUsers.has(user.name) ? "Suivi" : "Suivre"}
                          </Button>
                        </div>
                      </div>

                      {user.mutualConnections > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {user.mutualConnections} connexions en commun
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {myConnections.map((connection, index) => (
              <Card key={index} className="card-enhanced">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={connection.avatar} />
                        <AvatarFallback className="bg-gradient-brand text-white font-bold">
                          {connection.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {connection.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{connection.name}</h4>
                      <p className="text-sm text-primary">{connection.profession}</p>
                      <p className="text-xs text-muted-foreground">{connection.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">{connection.connectionDate}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium truncate max-w-48">{connection.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{connection.lastActive}</p>
                    </div>
                    
                    <Button size="sm" variant="outline" onClick={() => handleMessageUser(connection.name)}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-lg">Activité récente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="bg-gradient-brand text-white font-bold">
                      {activity.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card className="card-enhanced">
            <CardContent className="p-8 text-center">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune invitation en attente</h3>
              <p className="text-muted-foreground mb-4">
                Vous n'avez actuellement aucune invitation en attente. 
                Explorez les suggestions pour élargir votre réseau !
              </p>
              <Button onClick={() => setActiveTab("suggestions")}>
                Découvrir des artisans
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};