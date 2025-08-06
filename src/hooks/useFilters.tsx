import { useState } from "react";

export interface FilterOption {
  id: string;
  name: string;
  icon: string;
  count: number;
  trend: string;
  category?: string;
}

export function useFilters() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const filters: FilterOption[] = [
    { id: "all", name: "Tous", icon: "🏠", count: 1247, trend: "+12%" },
    { id: "coiffure", name: "Coiffeurs", icon: "✂️", count: 245, trend: "+12%", category: "coiffure" },
    { id: "couture", name: "Tailleurs", icon: "👔", count: 189, trend: "+8%", category: "couture" },
    { id: "menuiserie", name: "Menuisiers", icon: "🔨", count: 156, trend: "+15%", category: "menuiserie" },
    { id: "mecanique", name: "Mécaniciens", icon: "🔧", count: 203, trend: "+5%", category: "mecanique" },
    { id: "electricite", name: "Électriciens", icon: "⚡", count: 134, trend: "+18%", category: "electricite" },
    { id: "plomberie", name: "Plombiers", icon: "🚿", count: 45, trend: "+22%", category: "plomberie" },
    { id: "bijouterie", name: "Bijoutiers", icon: "💎", count: 78, trend: "+9%", category: "bijouterie" }
  ];

  const applyFilter = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const filterPosts = (posts: any[]) => {
    if (activeFilter === "all") {
      return posts;
    }
    
    return posts.filter(post => {
      const profession = post.profiles?.profession?.toLowerCase() || '';
      return profession.includes(activeFilter) || 
             profession.includes(filters.find(f => f.id === activeFilter)?.category || '');
    });
  };

  const filterArtisans = (artisans: any[]) => {
    if (activeFilter === "all") {
      return artisans;
    }
    
    return artisans.filter(artisan => {
      const profession = artisan.profession?.toLowerCase() || '';
      const category = artisan.category?.toLowerCase() || '';
      return profession.includes(activeFilter) || 
             category.includes(activeFilter) ||
             profession.includes(filters.find(f => f.id === activeFilter)?.category || '');
    });
  };

  return {
    filters,
    activeFilter,
    applyFilter,
    filterPosts,
    filterArtisans
  };
}