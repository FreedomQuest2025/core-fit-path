-- Create users table for profile information
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  fitness_goal TEXT,
  activity_level TEXT,
  preferred_workout_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create workouts table for workout programs
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7),
  type TEXT NOT NULL CHECK (type IN ('strength', 'mobility', 'speed', 'functional', 'recovery', 'plyometrics', 'core')),
  title TEXT NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  exercises JSONB NOT NULL,
  week INTEGER NOT NULL CHECK (week >= 1 AND week <= 12),
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_progress table for tracking workout completion
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_date TIMESTAMPTZ,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, workout_id, completion_date::date)
);

-- Create subscriptions table for payment tracking
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('free_trial', 'monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for workouts table (public read access)
CREATE POLICY "Everyone can view workouts"
  ON public.workouts FOR SELECT
  USING (true);

-- RLS Policies for user_progress table
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for subscriptions table
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample workout data
INSERT INTO public.workouts (day, type, title, duration, exercises, week, difficulty_level) VALUES
(1, 'strength', 'Upper Body Power', 25, '[
  {"name": "Push-ups", "reps": 12, "sets": 3, "rest_seconds": 45},
  {"name": "Pike Push-ups", "reps": 8, "sets": 3, "rest_seconds": 45},
  {"name": "Tricep Dips", "reps": 10, "sets": 3, "rest_seconds": 45},
  {"name": "Plank to T", "reps": 8, "sets": 2, "rest_seconds": 30}
]'::jsonb, 1, 'beginner'),

(2, 'mobility', 'Morning Flow', 20, '[
  {"name": "Cat-Cow Stretch", "duration_seconds": 60, "sets": 2},
  {"name": "Hip Circles", "reps": 10, "sets": 2, "direction": "each"},
  {"name": "Shoulder Rolls", "reps": 15, "sets": 2},
  {"name": "Spinal Twist", "hold_seconds": 30, "sets": 2, "side": "each"},
  {"name": "Deep Breathing", "duration_seconds": 120, "sets": 1}
]'::jsonb, 1, 'beginner'),

(3, 'functional', 'Core & Stability', 30, '[
  {"name": "Squats", "reps": 15, "sets": 3, "rest_seconds": 45},
  {"name": "Lunges", "reps": 12, "sets": 3, "rest_seconds": 45, "side": "each"},
  {"name": "Mountain Climbers", "duration_seconds": 30, "sets": 3, "rest_seconds": 45},
  {"name": "Dead Bug", "reps": 10, "sets": 2, "rest_seconds": 30, "side": "each"},
  {"name": "Wall Sit", "hold_seconds": 45, "sets": 2, "rest_seconds": 60}
]'::jsonb, 1, 'beginner'),

(4, 'speed', 'Cardio Burst', 25, '[
  {"name": "High Knees", "duration_seconds": 30, "sets": 4, "rest_seconds": 30},
  {"name": "Butt Kicks", "duration_seconds": 30, "sets": 4, "rest_seconds": 30},
  {"name": "Jumping Jacks", "duration_seconds": 45, "sets": 3, "rest_seconds": 45},
  {"name": "Burpees", "reps": 8, "sets": 3, "rest_seconds": 60}
]'::jsonb, 1, 'beginner'),

(5, 'plyometrics', 'Power Friday', 28, '[
  {"name": "Jump Squats", "reps": 12, "sets": 3, "rest_seconds": 60},
  {"name": "Lateral Bounds", "reps": 10, "sets": 3, "rest_seconds": 45, "side": "each"},
  {"name": "Plyo Push-ups", "reps": 6, "sets": 3, "rest_seconds": 60},
  {"name": "Tuck Jumps", "reps": 8, "sets": 2, "rest_seconds": 60}
]'::jsonb, 1, 'beginner'),

(6, 'recovery', 'Active Recovery', 15, '[
  {"name": "Gentle Yoga Flow", "duration_seconds": 300},
  {"name": "Foam Rolling", "duration_seconds": 240},
  {"name": "Deep Breathing", "duration_seconds": 180},
  {"name": "Meditation", "duration_seconds": 300}
]'::jsonb, 1, 'beginner'),

(7, 'core', 'Core Strength', 22, '[
  {"name": "Plank", "hold_seconds": 30, "sets": 3, "rest_seconds": 30},
  {"name": "Side Plank", "hold_seconds": 20, "sets": 2, "rest_seconds": 30, "side": "each"},
  {"name": "Russian Twists", "reps": 20, "sets": 3, "rest_seconds": 30},
  {"name": "Bicycle Crunches", "reps": 15, "sets": 3, "rest_seconds": 30, "side": "each"},
  {"name": "Hollow Body Hold", "hold_seconds": 20, "sets": 2, "rest_seconds": 45}
]'::jsonb, 1, 'beginner');