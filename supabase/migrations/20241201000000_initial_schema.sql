-- Initial schema migration for StaffAI project
-- This migration creates all the core tables for the application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Create media_assets table
CREATE TABLE public.media_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  file_name text,
  media_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT media_assets_pkey PRIMARY KEY (id)
);

-- Create effect_templates table
CREATE TABLE public.effect_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  prompt text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  category_id uuid,
  preview_media_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT effect_templates_pkey PRIMARY KEY (id),
  CONSTRAINT effect_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT effect_templates_preview_media_id_fkey FOREIGN KEY (preview_media_id) REFERENCES public.media_assets(id)
);

-- Create user_profile table
CREATE SEQUENCE user_profile_id_seq;
CREATE TABLE public.user_profile (
  id bigint NOT NULL DEFAULT nextval('user_profile_id_seq'::regclass),
  user_id uuid NOT NULL,
  overlap_replace_preference text NOT NULL DEFAULT 'ask'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_profile_pkey PRIMARY KEY (id),
  CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create video_generations table
CREATE TABLE public.video_generations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  input_image_url text NOT NULL,
  prompt text NOT NULL,
  selected_effects jsonb NOT NULL,
  model_type text NOT NULL CHECK (model_type = ANY (ARRAY['seedance'::text, 'hailo'::text])),
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text])),
  output_video_url text,
  error_message text,
  job_id text UNIQUE,
  webhook_status text CHECK (webhook_status = ANY (ARRAY['pending'::text, 'delivered'::text, 'failed'::text])),
  webhook_delivered_at timestamp with time zone,
  fal_request_id text,
  is_favorite boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT video_generations_pkey PRIMARY KEY (id),
  CONSTRAINT video_generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create project_saves table
CREATE TABLE public.project_saves (
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  user_id uuid NOT NULL,
  project_name text NOT NULL,
  content_snapshot jsonb NOT NULL,
  content_hash text NOT NULL,
  latest_render_id text,
  latest_video_url text,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_saves_pkey PRIMARY KEY (id),
  CONSTRAINT project_saves_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create video_renders table
CREATE TABLE public.video_renders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_name text NOT NULL,
  render_id text NOT NULL UNIQUE,
  status text DEFAULT 'processing'::text CHECK (status = ANY (ARRAY['processing'::text, 'completed'::text, 'failed'::text])),
  aspect_ratio text CHECK (aspect_ratio = ANY (ARRAY['9:16'::text, '1:1'::text, '16:9'::text])),
  duration_frames integer,
  output_url text,
  thumbnail_url text,
  video_clips jsonb,
  text_clips jsonb,
  sound_clips jsonb,
  content_hash text,
  project_save_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  CONSTRAINT video_renders_pkey PRIMARY KEY (id),
  CONSTRAINT video_renders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT video_renders_project_save_id_fkey FOREIGN KEY (project_save_id) REFERENCES public.project_saves(id)
);

-- Add foreign key constraint to project_saves after video_renders table is created
ALTER TABLE public.project_saves 
ADD CONSTRAINT project_saves_latest_render_id_fkey 
FOREIGN KEY (latest_render_id) REFERENCES public.video_renders(render_id);

-- Create sound_generations table
CREATE TABLE public.sound_generations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_id text UNIQUE,
  prompt text NOT NULL,
  title text,
  duration_seconds numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text])),
  output_audio_url text,
  error_message text,
  webhook_status text CHECK (webhook_status = ANY (ARRAY['pending'::text, 'delivered'::text, 'failed'::text])),
  webhook_delivered_at timestamp with time zone,
  fal_request_id text,
  generation_group_id text,
  variation_number integer CHECK (variation_number >= 1 AND variation_number <= 4),
  generation_type text DEFAULT 'sound_effect'::text CHECK (generation_type = ANY (ARRAY['sound_effect'::text, 'music'::text, 'from_video'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sound_generations_pkey PRIMARY KEY (id),
  CONSTRAINT sound_generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create image_brush_history table
CREATE TABLE public.image_brush_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  prompt text NOT NULL,
  result_url text NOT NULL,
  mode text DEFAULT 'flux'::text CHECK (mode = ANY (ARRAY['flux'::text, 'i2i'::text])),
  processing_time integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  original_image_url text,
  mask_image_url text,
  reference_image_url text,
  style_strength numeric DEFAULT 1.0 CHECK (style_strength >= 0.5 AND style_strength <= 1.5),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT image_brush_history_pkey PRIMARY KEY (id),
  CONSTRAINT image_brush_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create user_uploaded_videos table
CREATE TABLE public.user_uploaded_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint NOT NULL,
  duration double precision,
  aspect_ratio text,
  thumbnail_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  uploaded_at timestamp with time zone DEFAULT now(),
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_uploaded_videos_pkey PRIMARY KEY (id),
  CONSTRAINT user_uploaded_videos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create user_uploaded_music table
CREATE TABLE public.user_uploaded_music (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint NOT NULL,
  duration double precision,
  metadata jsonb DEFAULT '{}'::jsonb,
  uploaded_at timestamp with time zone DEFAULT now(),
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_uploaded_music_pkey PRIMARY KEY (id),
  CONSTRAINT user_uploaded_music_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_video_generations_user_id ON public.video_generations(user_id);
CREATE INDEX idx_video_generations_status ON public.video_generations(status);
CREATE INDEX idx_video_generations_created_at ON public.video_generations(created_at DESC);
CREATE INDEX idx_video_generations_job_id ON public.video_generations(job_id);

CREATE INDEX idx_project_saves_user_id ON public.project_saves(user_id);
CREATE INDEX idx_project_saves_created_at ON public.project_saves(created_at DESC);

CREATE INDEX idx_video_renders_user_id ON public.video_renders(user_id);
CREATE INDEX idx_video_renders_status ON public.video_renders(status);
CREATE INDEX idx_video_renders_render_id ON public.video_renders(render_id);

CREATE INDEX idx_sound_generations_user_id ON public.sound_generations(user_id);
CREATE INDEX idx_sound_generations_status ON public.sound_generations(status);
CREATE INDEX idx_sound_generations_job_id ON public.sound_generations(job_id);

CREATE INDEX idx_image_brush_history_user_id ON public.image_brush_history(user_id);
CREATE INDEX idx_image_brush_history_created_at ON public.image_brush_history(created_at DESC);

CREATE INDEX idx_user_uploaded_videos_user_id ON public.user_uploaded_videos(user_id);
CREATE INDEX idx_user_uploaded_videos_is_deleted ON public.user_uploaded_videos(is_deleted);

CREATE INDEX idx_user_uploaded_music_user_id ON public.user_uploaded_music(user_id);
CREATE INDEX idx_user_uploaded_music_is_deleted ON public.user_uploaded_music(is_deleted);

CREATE INDEX idx_effect_templates_category_id ON public.effect_templates(category_id);
CREATE INDEX idx_effect_templates_is_active ON public.effect_templates(is_active);
CREATE INDEX idx_effect_templates_display_order ON public.effect_templates(display_order);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.effect_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_renders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sound_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_brush_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_uploaded_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_uploaded_music ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for user-specific tables
-- Users can only access their own data

-- user_profile policies
CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE USING (auth.uid() = user_id);

-- video_generations policies
CREATE POLICY "Users can view own video generations" ON public.video_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video generations" ON public.video_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video generations" ON public.video_generations
  FOR UPDATE USING (auth.uid() = user_id);

-- project_saves policies
CREATE POLICY "Users can view own project saves" ON public.project_saves
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own project saves" ON public.project_saves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project saves" ON public.project_saves
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own project saves" ON public.project_saves
  FOR DELETE USING (auth.uid() = user_id);

-- video_renders policies
CREATE POLICY "Users can view own video renders" ON public.video_renders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video renders" ON public.video_renders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video renders" ON public.video_renders
  FOR UPDATE USING (auth.uid() = user_id);

-- sound_generations policies
CREATE POLICY "Users can view own sound generations" ON public.sound_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sound generations" ON public.sound_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sound generations" ON public.sound_generations
  FOR UPDATE USING (auth.uid() = user_id);

-- image_brush_history policies
CREATE POLICY "Users can view own image brush history" ON public.image_brush_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own image brush history" ON public.image_brush_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own image brush history" ON public.image_brush_history
  FOR UPDATE USING (auth.uid() = user_id);

-- user_uploaded_videos policies
CREATE POLICY "Users can view own uploaded videos" ON public.user_uploaded_videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploaded videos" ON public.user_uploaded_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploaded videos" ON public.user_uploaded_videos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploaded videos" ON public.user_uploaded_videos
  FOR DELETE USING (auth.uid() = user_id);

-- user_uploaded_music policies
CREATE POLICY "Users can view own uploaded music" ON public.user_uploaded_music
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploaded music" ON public.user_uploaded_music
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploaded music" ON public.user_uploaded_music
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploaded music" ON public.user_uploaded_music
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for categories, media_assets, and effect_templates
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view media assets" ON public.media_assets
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view active effect templates" ON public.effect_templates
  FOR SELECT USING (is_active = true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profile_updated_at 
  BEFORE UPDATE ON public.user_profile 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_generations_updated_at 
  BEFORE UPDATE ON public.video_generations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_saves_updated_at 
  BEFORE UPDATE ON public.project_saves 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sound_generations_updated_at 
  BEFORE UPDATE ON public.sound_generations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_brush_history_updated_at 
  BEFORE UPDATE ON public.image_brush_history 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_uploaded_videos_updated_at 
  BEFORE UPDATE ON public.user_uploaded_videos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_uploaded_music_updated_at 
  BEFORE UPDATE ON public.user_uploaded_music 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
