import { useState } from "react";
import { Shield, Eye, Lock, UserCheck, Download, Trash2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Privacy = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    contactInfo: "friends",
    activityStatus: true,
    readReceipts: true,
    locationSharing: false,
    searchVisibility: true,
    dataCollection: false,
    thirdPartySharing: false,
    advertisingPersonalization: false
  });

  const updateSetting = (key: string, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Paramètre mis à jour",
      description: "Vos paramètres de confidentialité ont été sauvegardés"
    });
  };

  const exportData = () => {
    toast({
      title: "Export des données",
      description: "Votre demande d'export a été enregistrée. Vous recevrez un email dans 24-48h."
    });
  };

  const deleteAccount = () => {
    toast({
      title: "Suppression de compte",
      description: "Cette action nécessite une confirmation par email",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-poppins font-bold">Confidentialité et Sécurité</h1>
            <p className="text-muted-foreground">Gérez vos paramètres de confidentialité et de sécurité</p>
          </div>
        </div>

        {/* Visibilité du profil */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visibilité du profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Qui peut voir votre profil</Label>
                  <p className="text-sm text-muted-foreground">
                    Contrôlez qui peut voir vos informations de profil
                  </p>
                </div>
                <Select 
                  value={privacySettings.profileVisibility} 
                  onValueChange={(value) => updateSetting("profileVisibility", value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Tout le monde</SelectItem>
                    <SelectItem value="friends">Amis uniquement</SelectItem>
                    <SelectItem value="private">Personne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Informations de contact</Label>
                  <p className="text-sm text-muted-foreground">
                    Qui peut voir votre numéro et email
                  </p>
                </div>
                <Select 
                  value={privacySettings.contactInfo} 
                  onValueChange={(value) => updateSetting("contactInfo", value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Tout le monde</SelectItem>
                    <SelectItem value="friends">Amis uniquement</SelectItem>
                    <SelectItem value="private">Personne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="searchVisibility">Apparaître dans les recherches</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux autres de vous trouver via la recherche
                  </p>
                </div>
                <Switch
                  id="searchVisibility"
                  checked={privacySettings.searchVisibility}
                  onCheckedChange={(checked) => updateSetting("searchVisibility", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activité et statut */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Activité et statut
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activityStatus">Statut d'activité</Label>
                <p className="text-sm text-muted-foreground">
                  Montrer quand vous êtes en ligne
                </p>
              </div>
              <Switch
                id="activityStatus"
                checked={privacySettings.activityStatus}
                onCheckedChange={(checked) => updateSetting("activityStatus", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="readReceipts">Accusés de lecture</Label>
                <p className="text-sm text-muted-foreground">
                  Confirmer la lecture des messages
                </p>
              </div>
              <Switch
                id="readReceipts"
                checked={privacySettings.readReceipts}
                onCheckedChange={(checked) => updateSetting("readReceipts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="locationSharing">Partage de localisation</Label>
                <p className="text-sm text-muted-foreground">
                  Partager votre position approximative
                </p>
              </div>
              <Switch
                id="locationSharing"
                checked={privacySettings.locationSharing}
                onCheckedChange={(checked) => updateSetting("locationSharing", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Données et publicité */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Données et publicité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dataCollection">Collecte de données analytiques</Label>
                <p className="text-sm text-muted-foreground">
                  Autoriser la collecte de données pour améliorer l'expérience
                </p>
              </div>
              <Switch
                id="dataCollection"
                checked={privacySettings.dataCollection}
                onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="thirdPartySharing">Partage avec des tiers</Label>
                <p className="text-sm text-muted-foreground">
                  Partager vos données avec des partenaires
                </p>
              </div>
              <Switch
                id="thirdPartySharing"
                checked={privacySettings.thirdPartySharing}
                onCheckedChange={(checked) => updateSetting("thirdPartySharing", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="advertisingPersonalization">Publicités personnalisées</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des publicités adaptées à vos intérêts
                </p>
              </div>
              <Switch
                id="advertisingPersonalization"
                checked={privacySettings.advertisingPersonalization}
                onCheckedChange={(checked) => updateSetting("advertisingPersonalization", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gestion des données */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Gestion des données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Télécharger vos données</Label>
                <p className="text-sm text-muted-foreground">
                  Obtenez une copie de toutes vos données
                </p>
              </div>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
            
            <Separator />
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                La suppression de votre compte est définitive et irréversible. 
                Toutes vos données seront perdues.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Supprimer votre compte</Label>
                <p className="text-sm text-muted-foreground">
                  Supprimer définitivement votre compte et toutes vos données
                </p>
              </div>
              <Button variant="destructive" onClick={deleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer le compte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations légales */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Informations légales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="justify-start p-0 h-auto">
              Politique de confidentialité
            </Button>
            <Button variant="ghost" className="justify-start p-0 h-auto">
              Conditions d'utilisation
            </Button>
            <Button variant="ghost" className="justify-start p-0 h-auto">
              Politique de cookies
            </Button>
            <Button variant="ghost" className="justify-start p-0 h-auto">
              Signaler un problème de confidentialité
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;