import { Home, Users, Plus, Bell, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const MobileNavigation = ({ currentSection, onSectionChange }: MobileNavigationProps) => {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 px-4 py-2 md:hidden">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-3 ${
              currentSection === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onSectionChange('home')}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Accueil</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-3 ${
              currentSection === 'search' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onSectionChange('search')}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Recherche</span>
          </Button>

          <CreatePostDialog>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground rounded-full w-12 h-12 p-0"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </CreatePostDialog>

          <NotificationsPanel>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-3 text-muted-foreground relative"
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs">Notifs</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></div>
            </Button>
          </NotificationsPanel>

          <UserProfileMenu>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-3 text-muted-foreground"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-brand text-white text-xs font-semibold">U</AvatarFallback>
              </Avatar>
              <span className="text-xs">Profil</span>
            </Button>
          </UserProfileMenu>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-poppins font-bold bg-gradient-brand bg-clip-text text-transparent">
            Zonaya
          </h1>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${
                currentSection === 'users' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
              onClick={() => onSectionChange('users')}
            >
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};