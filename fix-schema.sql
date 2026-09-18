-- Tambah columns yang missing dalam events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS dress_code VARCHAR(50);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rsvp_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS accent_color VARCHAR(20) DEFAULT '#f43f5e';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS facebook_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS instagram_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS whatsapp_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS website_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'free';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS angpao_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS bank_name VARCHAR(255);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS account_number VARCHAR(50);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS account_name VARCHAR(255);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS duitnow_number VARCHAR(50);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS duitnow_name VARCHAR(255);
