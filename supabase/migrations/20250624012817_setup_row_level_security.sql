-- Setup Row Level Security (RLS) policies with reusable functions

-- Create reusable security functions
CREATE OR REPLACE FUNCTION auth.user_owns_workout(workout_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workouts 
        WHERE workouts.id = workout_uuid 
        AND workouts.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.user_owns_routine(routine_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM routines 
        WHERE routines.id = routine_uuid 
        AND routines.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.user_owns_exercise(exercise_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM exercises 
        WHERE exercises.id = exercise_uuid 
        AND exercises.created_by = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.exercise_is_public_or_owned(exercise_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM exercises 
        WHERE exercises.id = exercise_uuid 
        AND (exercises.is_public = true OR exercises.created_by = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_history ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Exercises table policies
CREATE POLICY "View public or owned exercises" ON exercises
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create exercises" ON exercises
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own exercises" ON exercises
    FOR UPDATE USING (auth.user_owns_exercise(id));

CREATE POLICY "Users can delete their own exercises" ON exercises
    FOR DELETE USING (auth.user_owns_exercise(id));

-- Workouts table policies
CREATE POLICY "Users can view their own workouts" ON workouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workouts" ON workouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" ON workouts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" ON workouts
    FOR DELETE USING (auth.uid() = user_id);

-- Workout_exercises table policies
CREATE POLICY "View workout exercises for owned workouts" ON workout_exercises
    FOR SELECT USING (auth.user_owns_workout(workout_id));

CREATE POLICY "Manage workout exercises for owned workouts" ON workout_exercises
    FOR ALL USING (auth.user_owns_workout(workout_id));

-- Routines table policies
CREATE POLICY "Users can view their own routines" ON routines
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routines" ON routines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines" ON routines
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines" ON routines
    FOR DELETE USING (auth.uid() = user_id);

-- Routine_workouts table policies
CREATE POLICY "View routine workouts for owned routines" ON routine_workouts
    FOR SELECT USING (auth.user_owns_routine(routine_id));

CREATE POLICY "Manage routine workouts for owned routines" ON routine_workouts
    FOR ALL USING (auth.user_owns_routine(routine_id));

-- User_workout_history table policies
CREATE POLICY "Users can view their own workout history" ON user_workout_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout history" ON user_workout_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout history" ON user_workout_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout history" ON user_workout_history
    FOR DELETE USING (auth.uid() = user_id);