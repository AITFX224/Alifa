import { useState, useRef } from "react";
import { Hammer, Star, Users, Trophy, ArrowRight, Check, Upload, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const BecomeArtisan = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    businessName: "",
    profession: "",
    experience: "",
    description: "",
    location: "",
    phone: "",
    specialties: [] as string[],
    hasWorkshop: false,
    acceptsCommissions: false
  });

  const professions = [
    "Coiffeur/Coiffeuse",
    "Tailleur/Couturière",
    "Menuisier",
    "Mécanicien",
    "Électricien",
    "Bijoutier/Bijoutière",
    "Forgeron",
    "Potier",
    "Tisserand",
    "Cordonnier",
    "Autre"
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Visibilité accrue",
      description: "Atteignez plus de clients dans votre région"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Système de notation",
      description: "Construisez votre réputation avec les avis clients"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Badge vérifié",
      description: "Obtenez une certification qui inspire confiance"
    },
    {
      icon: <Hammer className="w-6 h-6" />,
      title: "Outils de gestion",
      description: "Gérez facilement vos commandes et clients"
    }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Demande envoyée !",
      description: "Votre demande d'artisan sera examinée sous 24-48h"
    });
    setStep(4);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 flex items-center justify-center">
        <Card className="card-enhanced max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-poppins font-bold mb-2">Demande envoyée !</h2>
            <p className="text-muted-foreground mb-6">
              Votre demande d'inscription en tant qu'artisan a été envoyée. 
              Notre équipe l'examinera dans les 24-48 heures.
            </p>
            <Button onClick={() => setStep(1)} className="w-full">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-poppins font-bold">Devenir Artisan</h1>
          <p className="text-muted-foreground">
            Rejoignez notre communauté d'artisans et développez votre activité
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Avantages */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Pourquoi devenir artisan vérifié ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Critères */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Critères d'éligibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Expérience minimum de 1 an</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Localisation en Guinée</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Numéro de téléphone valide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Portfolio ou échantillons de travail</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="businessName">Nom de votre entreprise/atelier</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Ex: Atelier Mamadou"
                  />
                </div>
                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Select value={formData.profession} onValueChange={(value) => handleInputChange("profession", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 ans</SelectItem>
                      <SelectItem value="3-5">3-5 ans</SelectItem>
                      <SelectItem value="6-10">6-10 ans</SelectItem>
                      <SelectItem value="10+">Plus de 10 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ex: Conakry, Kaloum"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description de votre activité</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Décrivez votre savoir-faire, vos spécialités..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+224 XXX XXX XXX"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Finalisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasWorkshop"
                  checked={formData.hasWorkshop}
                  onCheckedChange={(checked) => handleInputChange("hasWorkshop", checked)}
                />
                <Label htmlFor="hasWorkshop">J'ai un atelier physique</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptsCommissions"
                  checked={formData.acceptsCommissions}
                  onCheckedChange={(checked) => handleInputChange("acceptsCommissions", checked)}
                />
                <Label htmlFor="acceptsCommissions">J'accepte les commandes personnalisées</Label>
              </div>

              <div>
                <Label>Portfolio/Échantillons de travail</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <div 
                  className="mt-2 border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour ajouter des photos de vos réalisations
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
                    Choisir des fichiers
                  </Button>
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Images sélectionnées ({uploadedImages.length})</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Précédent
          </Button>
          <Button onClick={handleNext} className="flex items-center gap-2">
            {step === 3 ? "Envoyer la demande" : "Suivant"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BecomeArtisan;