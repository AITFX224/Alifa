import { useEffect, useState } from "react";
import { ArtisansSection } from "@/components/ArtisansSection";

const Artisans = () => {
  const [likedArtisans, setLikedArtisans] = useState<Set<string>>(new Set());

  useEffect(() => {
    // SEO
    document.title = "Artisans de Guinée - Trouver un artisan";
    const desc = "Trouvez des artisans qualifiés en Guinée par catégorie, sous-métier et localisation.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    if (!document.querySelector('link[rel="canonical"]')) {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", window.location.href);
      document.head.appendChild(link);
    }
  }, []);

  const handleLikeArtisan = (artisanId: string) => {
    setLikedArtisans(prev => {
      const next = new Set(prev);
      if (next.has(artisanId)) next.delete(artisanId); else next.add(artisanId);
      return next;
    });
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="sr-only">Artisans de Guinée - Annuaire</h1>
      <ArtisansSection
        likedArtisans={likedArtisans}
        onLikeArtisan={handleLikeArtisan}
        onContactArtisan={() => {}}
      />
    </main>
  );
};

export default Artisans;
