-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_user_privacy_visibility(target_user_id UUID)
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = 'public'
AS $$
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
$$;