import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reviews = () => {
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const reviewsReceived = [
    {
      id: 1,
      reviewer: "Fatou Diallo",
      rating: 5,
      comment: "Excellent travail ! Très satisfaite de ma nouvelle coiffure. Je recommande vivement.",
      date: "Il y a 2 jours",
      service: "Coiffure",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      reviewer: "Mamadou Camara",
      rating: 4,
      comment: "Bon travail, délai respecté. Petit détail à améliorer mais je suis content du résultat.",
      date: "Il y a 1 semaine",
      service: "Menuiserie",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      reviewer: "Aïssatou Barry",
      rating: 5,
      comment: "Service impeccable ! Très professionnel et à l'écoute. Je reviendrai certainement.",
      date: "Il y a 2 semaines",
      service: "Bijouterie",
      avatar: "/placeholder.svg"
    }
  ];

  const reviewsGiven = [
    {
      id: 1,
      artisan: "Ibrahim Diallo",
      rating: 5,
      comment: "Excellent électricien ! Travail soigné et tarifs raisonnables.",
      date: "Il y a 3 jours",
      service: "Électricité",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      artisan: "Mariama Soumah",
      rating: 4,
      comment: "Belle couture, mais délai un peu long. Résultat final satisfaisant.",
      date: "Il y a 1 semaine",
      service: "Couture",
      avatar: "/placeholder.svg"
    }
  ];

  const stats = {
    averageRating: 4.7,
    totalReviews: 23,
    fiveStars: 18,
    fourStars: 3,
    threeStars: 1,
    twoStars: 1,
    oneStars: 0
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const renderRatingBar = (count: number, total: number) => {
    const percentage = (count / total) * 100;
    return (
      <div className="flex items-center gap-2">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground w-8">{count}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-poppins font-bold">Mes Avis et Notes</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold">{stats.averageRating}</span>
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 ml-1" />
              </div>
              <p className="text-muted-foreground">Note moyenne</p>
              <div className="flex items-center justify-center mt-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalReviews}</div>
              <p className="text-muted-foreground">Avis reçus</p>
              <Badge variant="secondary" className="mt-2">
                +3 ce mois
              </Badge>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Répartition des notes</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-3">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {renderRatingBar(
                      stats[`${stars === 1 ? 'oneStars' : stars === 2 ? 'twoStars' : stars === 3 ? 'threeStars' : stars === 4 ? 'fourStars' : 'fiveStars'}` as keyof typeof stats] as number,
                      stats.totalReviews
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Avis reçus</TabsTrigger>
            <TabsTrigger value="given">Avis donnés</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {/* Filtres */}
            <div className="flex items-center gap-4">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par note" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  <SelectItem value="5">5 étoiles</SelectItem>
                  <SelectItem value="4">4 étoiles</SelectItem>
                  <SelectItem value="3">3 étoiles</SelectItem>
                  <SelectItem value="2">2 étoiles</SelectItem>
                  <SelectItem value="1">1 étoile</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="oldest">Plus anciens</SelectItem>
                  <SelectItem value="rating-high">Note décroissante</SelectItem>
                  <SelectItem value="rating-low">Note croissante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des avis reçus */}
            <div className="space-y-4">
              {reviewsReceived.map((review) => (
                <Card key={review.id} className="card-enhanced">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.reviewer}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <Badge variant="outline" className="text-xs">
                                {review.service}
                              </Badge>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Utile
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Répondre
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="given" className="space-y-4">
            {reviewsGiven.map((review) => (
              <Card key={review.id} className="card-enhanced">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.artisan[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.artisan}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <Badge variant="outline" className="text-xs">
                              {review.service}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reviews;