import { useState } from "react";
import { MessageCircle, Search, MoreHorizontal, Phone, Video } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessagesPanelProps {
  children: React.ReactNode;
}

export function MessagesPanel({ children }: MessagesPanelProps) {
  const [conversations] = useState([
    {
      id: 1,
      user: "Fatou Diallo",
      profession: "Coiffeuse",
      lastMessage: "Merci pour votre commande !",
      time: "2 min",
      unread: 2,
      online: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      user: "Mamadou Camara",
      profession: "Tailleur",
      lastMessage: "Le costume sera prêt demain",
      time: "1h",
      unread: 0,
      online: false,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      user: "Aïssatou Barry",
      profession: "Bijoutière",
      lastMessage: "Voici les photos des bijoux",
      time: "3h",
      unread: 1,
      online: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      user: "Ibrahim Diallo",
      profession: "Électricien",
      lastMessage: "Je peux venir à 14h",
      time: "1j",
      unread: 0,
      online: false,
      avatar: "/placeholder.svg"
    }
  ]);

  const totalUnread = conversations.reduce((total, conv) => total + conv.unread, 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {totalUnread > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {totalUnread}
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-poppins font-semibold text-lg">Messages</h3>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher des conversations..."
              className="pl-10 bg-muted/20 border-border/50"
            />
          </div>
        </div>

        <ScrollArea className="h-96">
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-gradient-brand text-white">
                      {conversation.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{conversation.user}</h4>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className="text-xs text-primary font-medium">{conversation.profession}</p>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  {conversation.unread > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="w-5 h-5 p-0 flex items-center justify-center text-xs"
                    >
                      {conversation.unread}
                    </Badge>
                  )}
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="w-6 h-6 p-0 hover:bg-primary/10">
                      <Phone className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-6 h-6 p-0 hover:bg-primary/10">
                      <Video className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border/50">
          <Button variant="ghost" className="w-full text-primary hover:bg-primary/10">
            Voir tous les messages
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}