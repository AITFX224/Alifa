import { useState } from "react";
import { Bell, Settings, Check, X, Star, Heart, MessageCircle, UserPlus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      title: "Nouveau like",
      message: "Fatou Diallo a aimé votre publication",
      time: "Il y a 5 minutes",
      read: false,
      avatar: "/placeholder.svg",
      icon: <Heart className="w-4 h-4 text-red-500" />
    },
    {
      id: 2,
      type: "comment",
      title: "Nouveau commentaire",
      message: "Mamadou Camara a commenté votre travail de menuiserie",
      time: "Il y a 1 heure",
      read: false,
      avatar: "/placeholder.svg",
      icon: <MessageCircle className="w-4 h-4 text-blue-500" />
    },
    {
      id: 3,
      type: "follow",
      title: "Nouvel abonné",
      message: "Aïssatou Barry a commencé à vous suivre",
      time: "Il y a 2 heures",
      read: true,
      avatar: "/placeholder.svg",
      icon: <UserPlus className="w-4 h-4 text-green-500" />
    },
    {
      id: 4,
      type: "review",
      title: "Nouvel avis",
      message: "Vous avez reçu un avis 5 étoiles de Ibrahim Diallo",
      time: "Il y a 1 jour",
      read: true,
      avatar: "/placeholder.svg",
      icon: <Star className="w-4 h-4 text-yellow-500" />
    }
  ]);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likesComments: true,
    newFollowers: true,
    reviews: true,
    messages: true,
    orders: true,
    marketing: false
  });

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "Notifications marquées",
      description: "Toutes les notifications ont été marquées comme lues"
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée"
    });
  };

  const updatePreference = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Préférence mise à jour",
      description: "Vos préférences de notification ont été sauvegardées"
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-4 h-4 text-red-500" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow": return <UserPlus className="w-4 h-4 text-green-500" />;
      case "review": return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-poppins font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground">
                  {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Filtres */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Toutes
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Non lues ({unreadCount})
              </Button>
              <Button
                variant={filter === "read" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("read")}
              >
                Lues
              </Button>
            </div>

            {/* Liste des notifications */}
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <Card className="card-enhanced">
                  <CardContent className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Aucune notification</h3>
                    <p className="text-muted-foreground">
                      {filter === "unread" 
                        ? "Toutes vos notifications sont lues" 
                        : "Vous n'avez pas encore de notifications"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`card-enhanced cursor-pointer transition-all duration-200 ${
                      !notification.read ? 'border-primary/50 bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(notification.type)}
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Méthodes de notification */}
                <div className="space-y-4">
                  <h3 className="font-medium">Méthodes de notification</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email">Notifications par email</Label>
                      <Switch
                        id="email"
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => updatePreference("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push">Notifications push</Label>
                      <Switch
                        id="push"
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => updatePreference("pushNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Types de notifications */}
                <div className="space-y-4">
                  <h3 className="font-medium">Types de notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="likes">Likes et commentaires</Label>
                        <p className="text-sm text-muted-foreground">
                          Quand quelqu'un aime ou commente vos publications
                        </p>
                      </div>
                      <Switch
                        id="likes"
                        checked={preferences.likesComments}
                        onCheckedChange={(checked) => updatePreference("likesComments", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="followers">Nouveaux abonnés</Label>
                        <p className="text-sm text-muted-foreground">
                          Quand quelqu'un commence à vous suivre
                        </p>
                      </div>
                      <Switch
                        id="followers"
                        checked={preferences.newFollowers}
                        onCheckedChange={(checked) => updatePreference("newFollowers", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reviews">Avis et notes</Label>
                        <p className="text-sm text-muted-foreground">
                          Quand vous recevez un nouvel avis
                        </p>
                      </div>
                      <Switch
                        id="reviews"
                        checked={preferences.reviews}
                        onCheckedChange={(checked) => updatePreference("reviews", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="messages">Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Nouveaux messages directs
                        </p>
                      </div>
                      <Switch
                        id="messages"
                        checked={preferences.messages}
                        onCheckedChange={(checked) => updatePreference("messages", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="orders">Commandes</Label>
                        <p className="text-sm text-muted-foreground">
                          Mises à jour des commandes et réservations
                        </p>
                      </div>
                      <Switch
                        id="orders"
                        checked={preferences.orders}
                        onCheckedChange={(checked) => updatePreference("orders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing">Marketing</Label>
                        <p className="text-sm text-muted-foreground">
                          Promotions et nouveautés
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => updatePreference("marketing", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;