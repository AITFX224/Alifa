import { useState } from "react";
import { HelpCircle, MessageCircle, Phone, Mail, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    category: "",
    subject: "",
    message: "",
    email: ""
  });

  const faqCategories = [
    {
      title: "Compte et profil",
      questions: [
        {
          question: "Comment modifier mon profil ?",
          answer: "Allez dans votre profil, cliquez sur 'Modifier' et mettez à jour vos informations. N'oubliez pas de sauvegarder vos modifications."
        },
        {
          question: "Comment changer mon mot de passe ?",
          answer: "Dans les paramètres de votre compte, cliquez sur 'Sécurité' puis 'Changer le mot de passe'. Suivez les instructions pour définir un nouveau mot de passe."
        },
        {
          question: "Puis-je supprimer mon compte ?",
          answer: "Oui, vous pouvez supprimer votre compte dans les paramètres de confidentialité. Cette action est irréversible."
        }
      ]
    },
    {
      title: "Artisans et services",
      questions: [
        {
          question: "Comment devenir artisan vérifié ?",
          answer: "Remplissez le formulaire 'Devenir artisan' avec vos informations professionnelles et votre portfolio. Notre équipe examinera votre demande sous 24-48h."
        },
        {
          question: "Comment publier mes services ?",
          answer: "Une fois votre profil artisan approuvé, vous pouvez créer des publications avec vos services, tarifs et portfolio."
        },
        {
          question: "Comment gérer les avis clients ?",
          answer: "Les avis apparaissent automatiquement sur votre profil. Vous pouvez y répondre dans la section 'Mes avis et notes'."
        }
      ]
    },
    {
      title: "Problèmes techniques",
      questions: [
        {
          question: "L'application ne se charge pas",
          answer: "Vérifiez votre connexion internet, fermez et rouvrez l'application. Si le problème persiste, contactez le support."
        },
        {
          question: "Je ne reçois pas les notifications",
          answer: "Vérifiez vos paramètres de notification dans l'application et autorisez les notifications dans les paramètres de votre appareil."
        },
        {
          question: "Problème de connexion",
          answer: "Essayez de vous déconnecter puis reconnecter. Si vous avez oublié votre mot de passe, utilisez la fonction 'Mot de passe oublié'."
        }
      ]
    }
  ];

  const contactMethods = [
    {
      title: "Chat en direct",
      description: "Discutez avec notre équipe support",
      icon: <MessageCircle className="w-6 h-6" />,
      action: "Démarrer le chat",
      available: "Lun-Ven 9h-18h"
    },
    {
      title: "Téléphone",
      description: "+224 XXX XXX XXX",
      icon: <Phone className="w-6 h-6" />,
      action: "Appeler",
      available: "Lun-Ven 9h-17h"
    },
    {
      title: "Email",
      description: "support@alifa.com",
      icon: <Mail className="w-6 h-6" />,
      action: "Envoyer un email",
      available: "Réponse sous 24h"
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Votre demande a été envoyée. Nous vous répondrons dans les plus brefs délais."
    });
    setContactForm({ category: "", subject: "", message: "", email: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredFAQ = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8" />
            <h1 className="text-3xl font-poppins font-bold">Aide et Support</h1>
          </div>
          <p className="text-muted-foreground">
            Comment pouvons-nous vous aider aujourd'hui ?
          </p>
        </div>

        {/* Barre de recherche */}
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* FAQ */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Questions fréquemment posées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFAQ.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun résultat trouvé pour "{searchQuery}"
                  </p>
                ) : (
                  filteredFAQ.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-2">
                      <h3 className="font-semibold text-lg">{category.title}</h3>
                      {category.questions.map((faq, faqIndex) => (
                        <Collapsible key={faqIndex}>
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/50 rounded-lg transition-colors">
                            <span className="font-medium">{faq.question}</span>
                            <ChevronDown className="w-4 h-4 transition-transform" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-3 pb-3">
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Formulaire de contact */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select 
                        value={contactForm.category} 
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Compte et profil</SelectItem>
                          <SelectItem value="artisan">Devenir artisan</SelectItem>
                          <SelectItem value="technical">Problème technique</SelectItem>
                          <SelectItem value="billing">Facturation</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Décrivez brièvement votre problème"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Décrivez votre problème en détail..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Méthodes de contact */}
          <div className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Autres moyens de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{method.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {method.description}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {method.available}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toast({
                            title: method.title,
                            description: `${method.action} - Fonctionnalité à venir`
                          })}
                        >
                          {method.action}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Ressources utiles */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Ressources utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Guide de démarrage
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Tutoriels vidéo
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Communauté
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Statut des services
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;