import { z } from 'zod';

// Post validation schemas
export const createPostSchema = z.object({
  content: z.string()
    .min(1, "Le contenu ne peut pas être vide")
    .max(2000, "Le contenu ne peut pas dépasser 2000 caractères"),
  event_title: z.string()
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .optional(),
  event_description: z.string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
  location: z.string()
    .max(200, "La localisation ne peut pas dépasser 200 caractères")
    .optional(),
  event_date: z.string().optional(),
  event_time: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(500, "Le commentaire ne peut pas dépasser 500 caractères"),
});

// Profile validation schemas
export const profileSchema = z.object({
  display_name: z.string()
    .min(1, "Le nom d'affichage est requis")
    .max(50, "Le nom d'affichage ne peut pas dépasser 50 caractères"),
  bio: z.string()
    .max(300, "La bio ne peut pas dépasser 300 caractères")
    .optional(),
  location: z.string()
    .max(100, "La localisation ne peut pas dépasser 100 caractères")
    .optional(),
  profession: z.string()
    .max(100, "La profession ne peut pas dépasser 100 caractères")
    .optional(),
  phone: z.string()
    .regex(/^\+?[\d\s-()]{10,}$/, "Format de téléphone invalide")
    .optional()
    .or(z.literal("")),
  website: z.string()
    .url("URL invalide")
    .optional()
    .or(z.literal("")),
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .max(254, "Email trop long"),
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const signupSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .max(254, "Email trop long"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/(?=.*[a-z])/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/(?=.*[A-Z])/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/(?=.*\d)/, "Le mot de passe doit contenir au moins un chiffre"),
  display_name: z.string()
    .min(1, "Le nom d'affichage est requis")
    .max(50, "Le nom d'affichage ne peut pas dépasser 50 caractères"),
});

// Privacy settings validation
export const privacySettingsSchema = z.object({
  profile_visibility: z.enum(['public', 'private', 'friends']),
  activity_status: z.boolean(),
  data_collection: z.boolean(),
  personalized_ads: z.boolean(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "Le fichier ne peut pas dépasser 10MB")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
      "Format de fichier non supporté"
    ),
});

export type CreatePostData = z.infer<typeof createPostSchema>;
export type CommentData = z.infer<typeof commentSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type PrivacySettingsData = z.infer<typeof privacySettingsSchema>;