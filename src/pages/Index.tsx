import { Search, Users, Camera, MapPin, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const artisanCategories = [
    { name: "Coiffeurs", icon: "✂️", count: 245 },
    { name: "Tailleurs", icon: "👔", count: 189 },
    { name: "Menuisiers", icon: "🔨", count: 156 },
    { name: "Mécaniciens", icon: "🔧", count: 203 },
    { name: "Bijoutiers", icon: "💍", count: 89 },
    { name: "Électriciens", icon: "⚡", count: 167 }
  ];

  const featuredArtisans = [
    {
      id: 1,
      name: "Fatou Diallo",
      profession: "Coiffeuse",
      location: "Conakry",
      rating: 4.8,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Mamadou Camara",
      profession: "Tailleur",
      location: "Kindia",
      rating: 4.9,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Aïssatou Barry",
      profession: "Bijoutière",
      location: "Labé",
      rating: 4.7,
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Zonaya</h1>
            <Button variant="secondary" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher un artisan, un métier, une ville..."
              className="pl-10 bg-background text-foreground"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Welcome Section */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">Trouvez les meilleurs artisans près de chez vous</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez et contactez facilement les artisans qualifiés de votre région. 
            Coiffeurs, tailleurs, menuisiers et bien d'autres métiers traditionnels à votre service.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center space-x-4 p-0">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Découvrir les artisans</h3>
                <p className="text-muted-foreground">Parcourir tous les artisans par métier et localisation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center space-x-4 p-0">
              <div className="bg-secondary/10 p-3 rounded-full">
                <Camera className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Fil d'actualité</h3>
                <p className="text-muted-foreground">Voir les dernières réalisations et promotions</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Categories */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Métiers populaires</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {artisanCategories.map((category, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h4 className="font-semibold text-sm">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.count} artisans</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Artisans */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Artisans recommandés</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArtisans.map((artisan) => (
              <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-muted"></div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg">{artisan.name}</h4>
                  <p className="text-muted-foreground">{artisan.profession}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{artisan.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{artisan.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Vous êtes artisan ?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Rejoignez Zonaya pour développer votre activité, montrer vos réalisations 
            et entrer en contact avec de nouveaux clients dans votre région.
          </p>
          <Button size="lg">
            Créer mon profil artisan
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 mt-12 p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="font-semibold mb-2">Zonaya</h4>
          <p className="text-sm text-muted-foreground">
            Le réseau social des artisans africains
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
