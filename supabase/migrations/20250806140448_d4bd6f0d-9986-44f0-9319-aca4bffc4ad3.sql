-- Create privacy settings table
CREATE TABLE public.privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  profile_visibility TEXT NOT NULL DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
  activity_status BOOLEAN NOT NULL DEFAULT true,
  data_collection BOOLEAN NOT NULL DEFAULT true,
  personalized_ads BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for privacy settings
CREATE POLICY "Users can view their own privacy settings" 
ON public.privacy_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own privacy settings" 
ON public.privacy_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy settings" 
ON public.privacy_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_privacy_settings_updated_at
BEFORE UPDATE ON public.privacy_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get user privacy settings with security definer
CREATE OR REPLACE FUNCTION public.get_user_privacy_visibility(target_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  visibility TEXT;
BEGIN
  SELECT profile_visibility 
  INTO visibility 
  FROM public.privacy_settings 
  WHERE user_id = target_user_id;
  
  -- Default to public if no settings found
  RETURN COALESCE(visibility, 'public');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update profiles RLS policy to respect privacy settings
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profiles are viewable based on privacy settings" 
ON public.profiles 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() = user_id THEN true  -- Users can always see their own profile
    WHEN public.get_user_privacy_visibility(user_id) = 'public' THEN true
    ELSE false
  END
);