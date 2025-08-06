-- Create a better relationship between posts and profiles
-- First, let's make sure posts reference profiles instead of auth.users
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;

-- Add foreign key to profiles table
ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) 
ON DELETE CASCADE;