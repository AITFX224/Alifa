import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    darkMode: false,
    language: "fr",
    privacy: "public",
    twoFactor: false,
    autoSave: true,
    soundEffects: true,
    dataUsage: "normal"
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Paramètre mis à jour",
      description: "Vos préférences ont été sauvegardées"
    });
  };

  const settingSections = [
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          key: "emailNotifications",
          label: "Notifications par email",
          description: "Recevoir des notifications par email",
          type: "switch"
        },
        {
          key: "pushNotifications",
          label: "Notifications push",
          description: "Recevoir des notifications sur l'appareil",
          type: "switch"
        },
        {
          key: "smsNotifications",
          label: "Notifications SMS",
          description: "Recevoir des SMS pour les notifications importantes",
          type: "switch"
        }
      ]
    },
    {
      title: "Apparence",
      icon: <Palette className="w-5 h-5" />,
      items: [
        {
          key: "darkMode",
          label: "Mode sombre",
          description: "Utiliser le thème sombre",
          type: "switch"
        },
        {
          key: "language",
          label: "Langue",
          description: "Choisir la langue de l'interface",
          type: "select",
          options: [
            { value: "fr", label: "Français" },
            { value: "en", label: "English" },
            { value: "pular", label: "Pular" },
            { value: "mandinka", label: "Mandinka" }
          ]
        }
      ]
    },
    {
      title: "Confidentialité",
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          key: "privacy",
          label: "Profil public",
          description: "Visibilité de votre profil",
          type: "select",
          options: [
            { value: "public", label: "Public" },
            { value: "friends", label: "Amis uniquement" },
            { value: "private", label: "Privé" }
          ]
        },
        {
          key: "twoFactor",
          label: "Authentification à deux facteurs",
          description: "Sécurité renforcée pour votre compte",
          type: "switch"
        }
      ]
    },
    {
      title: "Application",
      icon: <Smartphone className="w-5 h-5" />,
      items: [
        {
          key: "autoSave",
          label: "Sauvegarde automatique",
          description: "Sauvegarder automatiquement vos brouillons",
          type: "switch"
        },
        {
          key: "soundEffects",
          label: "Effets sonores",
          description: "Jouer des sons pour les interactions",
          type: "switch"
        },
        {
          key: "dataUsage",
          label: "Utilisation des données",
          description: "Contrôler la consommation de données",
          type: "select",
          options: [
            { value: "low", label: "Économique" },
            { value: "normal", label: "Normal" },
            { value: "high", label: "Haute qualité" }
          ]
        }
      ]
    }
  ];

  const renderSettingItem = (item: any) => {
    if (item.type === "switch") {
      return (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor={item.key}>{item.label}</Label>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <Switch
            id={item.key}
            checked={settings[item.key as keyof typeof settings] as boolean}
            onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
          />
        </div>
      );
    }

    if (item.type === "select") {
      return (
        <div className="space-y-2">
          <Label htmlFor={item.key}>{item.label}</Label>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <Select 
            value={settings[item.key as keyof typeof settings] as string}
            onValueChange={(value) => handleSettingChange(item.key, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {item.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full hover:bg-muted/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SettingsIcon className="w-8 h-8" />
          <h1 className="text-3xl font-poppins font-bold">Paramètres</h1>
        </div>

        {/* Sections de paramètres */}
        <div className="space-y-6">
          {settingSections.map((section, index) => (
            <Card key={index} className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {renderSettingItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Réinitialiser les paramètres</Label>
                <p className="text-sm text-muted-foreground">
                  Remettre tous les paramètres à leurs valeurs par défaut
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => toast({
                  title: "Paramètres réinitialisés",
                  description: "Tous les paramètres ont été remis par défaut"
                })}
              >
                Réinitialiser
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Supprimer le compte</Label>
                <p className="text-sm text-muted-foreground">
                  Supprimer définitivement votre compte et toutes vos données
                </p>
              </div>
              <Button 
                variant="destructive"
                onClick={() => toast({
                  title: "Confirmation requise",
                  description: "Cette action nécessite une confirmation par email"
                })}
              >
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;