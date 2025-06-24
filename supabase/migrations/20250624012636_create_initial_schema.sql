-- Create initial database schema for fitness journey app

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    muscle_groups TEXT[] DEFAULT '{}',
    equipment_needed TEXT[] DEFAULT '{}',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    exercise_type TEXT CHECK (exercise_type IN ('strength', 'cardio', 'flexibility')) DEFAULT 'strength',
    instructions TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    estimated_duration INTEGER, -- in minutes
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises table (junction table)
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    sets INTEGER DEFAULT 1,
    reps INTEGER DEFAULT 1,
    weight DECIMAL(10,2), -- weight in lbs or kg
    rest_time_seconds INTEGER DEFAULT 60,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workout_id, exercise_id, order_index)
);

-- Create routines table
CREATE TABLE routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER DEFAULT 4,
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routine_workouts table (junction table)
CREATE TABLE routine_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7), -- 1 = Monday, 7 = Sunday
    week_number INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(routine_id, day_of_week, week_number, order_index)
);

-- Create user_workout_history table
CREATE TABLE user_workout_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment_needed);
CREATE INDEX idx_exercises_type ON exercises(exercise_type);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX idx_exercises_public ON exercises(is_public);

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_template ON workouts(is_template);
CREATE INDEX idx_workouts_difficulty ON workouts(difficulty_level);

CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_order ON workout_exercises(workout_id, order_index);

CREATE INDEX idx_routines_user_id ON routines(user_id);
CREATE INDEX idx_routines_template ON routines(is_template);

CREATE INDEX idx_routine_workouts_routine_id ON routine_workouts(routine_id);
CREATE INDEX idx_routine_workouts_workout_id ON routine_workouts(workout_id);
CREATE INDEX idx_routine_workouts_schedule ON routine_workouts(routine_id, day_of_week, week_number);

CREATE INDEX idx_user_workout_history_user_id ON user_workout_history(user_id);
CREATE INDEX idx_user_workout_history_workout_id ON user_workout_history(workout_id);
CREATE INDEX idx_user_workout_history_completed_at ON user_workout_history(completed_at);

-- Create function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_exercises_updated_at BEFORE UPDATE ON workout_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routine_workouts_updated_at BEFORE UPDATE ON routine_workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_workout_history_updated_at BEFORE UPDATE ON user_workout_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();