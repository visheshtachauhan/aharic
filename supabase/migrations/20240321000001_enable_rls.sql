-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items table
-- Allow public read access to all menu items
CREATE POLICY "Public Read Access"
ON public.menu_items
FOR SELECT
USING (true);

-- Allow authenticated users to insert menu items
CREATE POLICY "Authenticated Insert"
ON public.menu_items
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own menu items
CREATE POLICY "Authenticated Update"
ON public.menu_items
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own menu items
CREATE POLICY "Authenticated Delete"
ON public.menu_items
FOR DELETE
USING (auth.role() = 'authenticated');

-- Create an index on the category column for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);

-- Create an index on the is_available column for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items(is_available);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_menu_items_category_available ON public.menu_items(category, is_available);

-- Fix the update_updated_at_column function to use a secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public; 