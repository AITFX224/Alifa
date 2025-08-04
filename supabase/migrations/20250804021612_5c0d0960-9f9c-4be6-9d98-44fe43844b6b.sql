-- Create storage buckets for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('posts-media', 'posts-media', true);

-- Create policies for posts media uploads
CREATE POLICY "Anyone can view posts media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'posts-media');

CREATE POLICY "Authenticated users can upload posts media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'posts-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own posts media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'posts-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own posts media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'posts-media' AND auth.uid()::text = (storage.foldername(name))[1]);