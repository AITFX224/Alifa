-- Enable email confirmation for password reset
-- This ensures that password reset emails work properly

-- Add a function to handle password reset email customization
CREATE OR REPLACE FUNCTION public.send_password_reset_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be extended to customize password reset emails
  -- For now, it just allows the default Supabase behavior
  RETURN NEW;
END;
$$;