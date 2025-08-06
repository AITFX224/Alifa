import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Briefcase, Star, Bell, Shield, HelpCircle, Moon, Sun } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
interface UserProfileMenuProps {
  children: React.ReactNode;
}
export function UserProfileMenu({
  children
}: UserProfileMenuProps) {
  const [darkMode, setDarkMode] = useState(false);
  const {
    toast
  } = useToast();
  const {
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Zonaya !"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive"
      });
    }
  };
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Ici vous pourriez implémenter la logique du mode sombre
    document.documentElement.classList.toggle('dark');
    toast({
      title: `Mode ${!darkMode ? 'sombre' : 'clair'} activé`,
      description: `L'interface est maintenant en mode ${!darkMode ? 'sombre' : 'clair'}`
    });
  };
  return <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-card/95 backdrop-blur-md border border-border/50" align="end" sideOffset={8}>
        {/* Profile Header */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-brand text-white font-semibold">
                U
              </AvatarFallback>
            </Avatar>
            <div>
              
              <p className="text-sm text-muted-foreground">utilisateur@zonaya.com</p>
            </div>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Menu Items */}
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/30" onClick={() => handleNavigation("/profile")}>
            <User className="w-4 h-4 mr-3" />
            Mon profil
          </Button>

          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/30" onClick={() => handleNavigation("/become-artisan")}>
            <Briefcase className="w-4 h-4 mr-3" />
            Devenir artisan
          </Button>

          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/30" onClick={() => handleNavigation("/reviews")}>
            <Star className="w-4 h-4 mr-3" />
            Mes avis et notes
          </Button>

          <Separator className="my-2 opacity-50" />

          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/30" onClick={() => handleNavigation("/settings")}>
            <Settings className="w-4 h-4 mr-3" />
            Paramètres
          </Button>

          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/30" onClick={() => handleNavigation("/notifications")}>
            <Bell className="w-4 h-4 mr-3" />
            Préférences notifications
          </Button>

          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/30" onClick={() => handleNavigation("/privacy")}>
            <Shield className="w-4 h-4 mr-3" />
            Confidentialité et sécurité
          </Button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-md">
            <div className="flex items-center">
              {darkMode ? <Moon className="w-4 h-4 mr-3" /> : <Sun className="w-4 h-4 mr-3" />}
              Mode sombre
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          <Separator className="my-2 opacity-50" />

          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/30" onClick={() => handleNavigation("/support")}>
            <HelpCircle className="w-4 h-4 mr-3" />
            Aide et support
          </Button>

          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-destructive/10 hover:text-destructive text-destructive" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-3" />
            Se déconnecter
          </Button>
        </div>
      </PopoverContent>
    </Popover>;
}