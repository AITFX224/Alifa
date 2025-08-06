-- Créer une table pour les tendances
CREATE TABLE public.trending_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  hashtag TEXT NOT NULL,
  posts_count INTEGER NOT NULL DEFAULT 0,
  growth_percentage TEXT NOT NULL DEFAULT '0%',
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter des colonnes manquantes à la table profiles pour les artisans
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;

-- Activer RLS sur trending_topics
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;

-- Politiques pour trending_topics (lecture publique, écriture admin seulement)
CREATE POLICY "Trending topics are viewable by everyone" 
ON public.trending_topics 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage trending topics" 
ON public.trending_topics 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_trending_topics_updated_at
BEFORE UPDATE ON public.trending_topics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques données de test pour les tendances
INSERT INTO public.trending_topics (title, hashtag, posts_count, growth_percentage, category) VALUES
('Coiffure Moderne', '#CoiffureModerne', 1247, '+12%', 'coiffure'),
('Artisanat Local', '#ArtisanatLocal', 856, '+8%', 'general'),
('Menuiserie Traditionnelle', '#MenuiserieTrad', 423, '+15%', 'menuiserie'),
('Mode Africaine', '#ModeAfricaine', 789, '+22%', 'couture'),
('Électricité Verte', '#ElectriciteVerte', 345, '+18%', 'electricite');