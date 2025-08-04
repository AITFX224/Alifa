import { useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, Star, MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationsPanelProps {
  children: React.ReactNode;
}

export function NotificationsPanel({ children }: NotificationsPanelProps) {
  const [notifications] = useState([
    {
      id: 1,
      type: "like",
      user: "Fatou Diallo",
      action: "a aimé votre publication",
      time: "Il y a 5 min",
      avatar: "/placeholder.svg",
      unread: true
    },
    {
      id: 2,
      type: "comment",
      user: "Mamadou Camara",
      action: "a commenté votre publication",
      time: "Il y a 15 min",
      avatar: "/placeholder.svg",
      unread: true
    },
    {
      id: 3,
      type: "follow",
      user: "Aïssatou Barry",
      action: "a commencé à vous suivre",
      time: "Il y a 1h",
      avatar: "/placeholder.svg",
      unread: false
    },
    {
      id: 4,
      type: "rating",
      user: "Ibrahim Diallo",
      action: "vous a donné 5 étoiles",
      time: "Il y a 2h",
      avatar: "/placeholder.svg",
      unread: false
    },
    {
      id: 5,
      type: "message",
      user: "Mariama Soumah",
      action: "vous a envoyé un message",
      time: "Il y a 3h",
      avatar: "/placeholder.svg",
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-destructive fill-destructive" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-primary" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-success" />;
      case "rating":
        return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case "message":
        return <MessageCircle className="w-4 h-4 text-info" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-card/95 backdrop-blur-md border border-border/50" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-semibold text-lg">Notifications</h3>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-primary/5' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback className="bg-gradient-brand text-white">
                      {notification.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-1 border border-border/50">
                    {getIcon(notification.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{notification.user}</span>
                    <span className="text-muted-foreground"> {notification.action}</span>
                  </p>
                  <p className="text-xs text-primary mt-1">{notification.time}</p>
                </div>

                {notification.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border/50">
          <Button variant="ghost" className="w-full text-primary hover:bg-primary/10">
            Voir toutes les notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}