-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  cycle_duration INTEGER DEFAULT 28,
  last_period_date DATE,
  birth_date DATE,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create mood tracking table
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  notes TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood entries" 
ON public.mood_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood entries" 
ON public.mood_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries" 
ON public.mood_entries FOR DELETE 
USING (auth.uid() = user_id);

-- Create swelling tracking table
CREATE TABLE public.swelling_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER CHECK (level >= 1 AND level <= 5),
  areas TEXT[],
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.swelling_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own swelling entries" 
ON public.swelling_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own swelling entries" 
ON public.swelling_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create hydration tracking table
CREATE TABLE public.hydration_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  glasses INTEGER DEFAULT 0,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

ALTER TABLE public.hydration_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hydration entries" 
ON public.hydration_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hydration entries" 
ON public.hydration_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hydration entries" 
ON public.hydration_entries FOR UPDATE 
USING (auth.uid() = user_id);

-- Create daily checklist table
CREATE TABLE public.daily_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

ALTER TABLE public.daily_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checklist" 
ON public.daily_checklist FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklist" 
ON public.daily_checklist FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist" 
ON public.daily_checklist FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (new.id, new.raw_user_meta_data ->> 'name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();