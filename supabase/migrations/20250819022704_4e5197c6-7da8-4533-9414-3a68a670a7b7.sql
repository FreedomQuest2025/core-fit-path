-- Insert sample workout data
INSERT INTO public.workouts (day, type, title, duration, exercises, week, difficulty_level) VALUES
(1, 'strength', 'Upper Body Power', 25, '[
  {"name": "Push-ups", "reps": 12, "sets": 3, "rest_seconds": 45},
  {"name": "Pike Push-ups", "reps": 8, "sets": 3, "rest_seconds": 45},
  {"name": "Tricep Dips", "reps": 10, "sets": 3, "rest_seconds": 45},
  {"name": "Plank to T", "reps": 8, "sets": 2, "rest_seconds": 30}
]', 1, 'beginner'),

(2, 'mobility', 'Morning Flow', 20, '[
  {"name": "Cat-Cow Stretch", "duration_seconds": 60, "sets": 2},
  {"name": "Hip Circles", "reps": 10, "sets": 2, "direction": "each"},
  {"name": "Shoulder Rolls", "reps": 15, "sets": 2},
  {"name": "Spinal Twist", "hold_seconds": 30, "sets": 2, "side": "each"},
  {"name": "Deep Breathing", "duration_seconds": 120, "sets": 1}
]', 1, 'beginner'),

(3, 'functional', 'Core & Stability', 30, '[
  {"name": "Squats", "reps": 15, "sets": 3, "rest_seconds": 45},
  {"name": "Lunges", "reps": 12, "sets": 3, "rest_seconds": 45, "side": "each"},
  {"name": "Mountain Climbers", "duration_seconds": 30, "sets": 3, "rest_seconds": 45},
  {"name": "Dead Bug", "reps": 10, "sets": 2, "rest_seconds": 30, "side": "each"},
  {"name": "Wall Sit", "hold_seconds": 45, "sets": 2, "rest_seconds": 60}
]', 1, 'beginner'),

(4, 'speed', 'Cardio Burst', 25, '[
  {"name": "High Knees", "duration_seconds": 30, "sets": 4, "rest_seconds": 30},
  {"name": "Butt Kicks", "duration_seconds": 30, "sets": 4, "rest_seconds": 30},
  {"name": "Jumping Jacks", "duration_seconds": 45, "sets": 3, "rest_seconds": 45},
  {"name": "Burpees", "reps": 8, "sets": 3, "rest_seconds": 60}
]', 1, 'beginner'),

(5, 'plyometrics', 'Power Friday', 28, '[
  {"name": "Jump Squats", "reps": 12, "sets": 3, "rest_seconds": 60},
  {"name": "Lateral Bounds", "reps": 10, "sets": 3, "rest_seconds": 45, "side": "each"},
  {"name": "Plyo Push-ups", "reps": 6, "sets": 3, "rest_seconds": 60},
  {"name": "Tuck Jumps", "reps": 8, "sets": 2, "rest_seconds": 60}
]', 1, 'beginner'),

(6, 'recovery', 'Active Recovery', 15, '[
  {"name": "Gentle Yoga Flow", "duration_seconds": 300},
  {"name": "Foam Rolling", "duration_seconds": 240},
  {"name": "Deep Breathing", "duration_seconds": 180},
  {"name": "Meditation", "duration_seconds": 300}
]', 1, 'beginner'),

(7, 'core', 'Core Strength', 22, '[
  {"name": "Plank", "hold_seconds": 30, "sets": 3, "rest_seconds": 30},
  {"name": "Side Plank", "hold_seconds": 20, "sets": 2, "rest_seconds": 30, "side": "each"},
  {"name": "Russian Twists", "reps": 20, "sets": 3, "rest_seconds": 30},
  {"name": "Bicycle Crunches", "reps": 15, "sets": 3, "rest_seconds": 30, "side": "each"},
  {"name": "Hollow Body Hold", "hold_seconds": 20, "sets": 2, "rest_seconds": 45}
]', 1, 'beginner');