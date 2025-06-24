-- Seed initial exercises for the fitness app
-- These exercises are created without a specific user (created_by = null) and are public

INSERT INTO exercises (name, description, muscle_groups, equipment_needed, difficulty_level, exercise_type, instructions, is_public) VALUES
-- Chest Exercises
('Push-up', 'A basic bodyweight exercise for chest, shoulders, and triceps', ARRAY['chest', 'shoulders', 'triceps'], ARRAY[]::text[], 'beginner', 'strength', 'Start in plank position, lower body until chest nearly touches ground, push back up', true),
('Bench Press', 'Classic barbell chest exercise', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['barbell', 'bench'], 'intermediate', 'strength', 'Lie on bench, grip barbell shoulder-width apart, lower to chest, press up', true),
('Incline Dumbbell Press', 'Upper chest focused dumbbell press', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbells', 'incline bench'], 'intermediate', 'strength', 'Set bench to 30-45 degrees, press dumbbells from chest level', true),
('Dumbbell Flyes', 'Isolation exercise for chest', ARRAY['chest'], ARRAY['dumbbells', 'bench'], 'intermediate', 'strength', 'Lie on bench, arms slightly bent, lower dumbbells in arc motion, squeeze chest', true),

-- Back Exercises
('Pull-up', 'Bodyweight back and bicep exercise', ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'intermediate', 'strength', 'Hang from bar, pull body up until chin over bar, lower with control', true),
('Bent-over Row', 'Compound back exercise with barbell', ARRAY['back', 'biceps'], ARRAY['barbell'], 'intermediate', 'strength', 'Hinge at hips, row barbell to lower chest, squeeze shoulder blades', true),
('Lat Pulldown', 'Seated back exercise using cable machine', ARRAY['back', 'biceps'], ARRAY['cable machine'], 'beginner', 'strength', 'Sit at machine, pull bar down to upper chest, control the weight up', true),
('Deadlift', 'Full body compound movement', ARRAY['back', 'glutes', 'hamstrings', 'traps'], ARRAY['barbell'], 'advanced', 'strength', 'Stand with feet hip-width, grip bar, lift by extending hips and knees', true),

-- Shoulder Exercises
('Overhead Press', 'Standing shoulder press with barbell', ARRAY['shoulders', 'triceps', 'core'], ARRAY['barbell'], 'intermediate', 'strength', 'Stand with feet shoulder-width, press barbell overhead, keep core tight', true),
('Lateral Raise', 'Side deltoid isolation exercise', ARRAY['shoulders'], ARRAY['dumbbells'], 'beginner', 'strength', 'Hold dumbbells at sides, raise arms to shoulder height, lower with control', true),
('Front Raise', 'Front deltoid isolation exercise', ARRAY['shoulders'], ARRAY['dumbbells'], 'beginner', 'strength', 'Hold dumbbells in front of thighs, raise forward to shoulder height', true),
('Face Pull', 'Rear deltoid and upper back exercise', ARRAY['shoulders', 'back'], ARRAY['cable machine'], 'intermediate', 'strength', 'Pull cable to face level, squeeze shoulder blades, focus on rear delts', true),

-- Arm Exercises
('Bicep Curl', 'Basic bicep isolation exercise', ARRAY['biceps'], ARRAY['dumbbells'], 'beginner', 'strength', 'Hold dumbbells at sides, curl up while keeping elbows stationary', true),
('Tricep Dip', 'Bodyweight tricep exercise', ARRAY['triceps'], ARRAY['dip bars'], 'intermediate', 'strength', 'Support body on bars, lower until shoulders below elbows, push back up', true),
('Hammer Curl', 'Neutral grip bicep exercise', ARRAY['biceps', 'forearms'], ARRAY['dumbbells'], 'beginner', 'strength', 'Hold dumbbells with neutral grip, curl up without rotating wrists', true),
('Tricep Extension', 'Overhead tricep isolation', ARRAY['triceps'], ARRAY['dumbbell'], 'beginner', 'strength', 'Hold dumbbell overhead, lower behind head, extend back to start', true),

-- Leg Exercises
('Squat', 'Fundamental lower body exercise', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell'], 'intermediate', 'strength', 'Stand with feet shoulder-width, squat down until thighs parallel, drive through heels', true),
('Lunge', 'Single-leg lower body exercise', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY[]::text[], 'beginner', 'strength', 'Step forward into lunge position, lower back knee toward ground, push back to start', true),
('Romanian Deadlift', 'Hip-hinge movement targeting hamstrings', ARRAY['hamstrings', 'glutes'], ARRAY['barbell'], 'intermediate', 'strength', 'Hold barbell, hinge at hips, lower bar along legs, drive hips forward', true),
('Calf Raise', 'Isolation exercise for calves', ARRAY['calves'], ARRAY[]::text[], 'beginner', 'strength', 'Rise up on toes, squeeze calves at top, lower with control', true),
('Bulgarian Split Squat', 'Single-leg squat variation', ARRAY['quadriceps', 'glutes'], ARRAY['bench'], 'intermediate', 'strength', 'Rear foot elevated, squat down on front leg, drive through heel to return', true),

-- Core Exercises  
('Plank', 'Isometric core strengthening exercise', ARRAY['core', 'shoulders'], ARRAY[]::text[], 'beginner', 'strength', 'Hold push-up position, keep body straight, engage core throughout', true),
('Crunch', 'Basic abdominal exercise', ARRAY['core'], ARRAY[]::text[], 'beginner', 'strength', 'Lie on back, curl shoulders toward knees, focus on contracting abs', true),
('Russian Twist', 'Rotational core exercise', ARRAY['core', 'obliques'], ARRAY[]::text[], 'intermediate', 'strength', 'Sit with knees bent, lean back slightly, rotate torso side to side', true),
('Mountain Climber', 'Dynamic core and cardio exercise', ARRAY['core', 'shoulders'], ARRAY[]::text[], 'intermediate', 'cardio', 'Start in plank, alternate bringing knees to chest quickly', true),
('Dead Bug', 'Core stability exercise', ARRAY['core'], ARRAY[]::text[], 'beginner', 'strength', 'Lie on back, arms up, knees at 90 degrees, alternate extending opposite arm and leg', true),

-- Cardio Exercises
('Running', 'Aerobic cardiovascular exercise', ARRAY['legs', 'cardiovascular'], ARRAY[]::text[], 'beginner', 'cardio', 'Maintain steady pace, focus on breathing and form', true),
('Cycling', 'Low-impact cardiovascular exercise', ARRAY['legs', 'cardiovascular'], ARRAY['bike'], 'beginner', 'cardio', 'Maintain steady cadence, adjust resistance as needed', true),
('Jumping Jacks', 'Full-body cardio exercise', ARRAY['legs', 'shoulders', 'cardiovascular'], ARRAY[]::text[], 'beginner', 'cardio', 'Jump feet apart while raising arms overhead, return to start', true),
('Burpee', 'High-intensity full-body exercise', ARRAY['full body', 'cardiovascular'], ARRAY[]::text[], 'advanced', 'cardio', 'Squat, kick back to plank, push-up, jump feet forward, jump up', true),
('High Knees', 'Running in place with high knee lift', ARRAY['legs', 'cardiovascular'], ARRAY[]::text[], 'beginner', 'cardio', 'Run in place bringing knees up toward chest', true),

-- Flexibility Exercises
('Forward Fold', 'Hamstring and back stretch', ARRAY['hamstrings', 'back'], ARRAY[]::text[], 'beginner', 'flexibility', 'Stand with feet hip-width, fold forward reaching toward toes', true),
('Cat-Cow Stretch', 'Spinal mobility exercise', ARRAY['back', 'core'], ARRAY[]::text[], 'beginner', 'flexibility', 'On hands and knees, alternate arching and rounding spine', true),
('Pigeon Pose', 'Hip flexibility stretch', ARRAY['hips', 'glutes'], ARRAY[]::text[], 'intermediate', 'flexibility', 'From downward dog, bring one knee forward, extend other leg back', true),
('Child''s Pose', 'Resting stretch for back and hips', ARRAY['back', 'hips'], ARRAY[]::text[], 'beginner', 'flexibility', 'Kneel and sit back on heels, extend arms forward, rest forehead down', true),
('Downward Dog', 'Full-body stretch and strengthener', ARRAY['shoulders', 'hamstrings', 'calves'], ARRAY[]::text[], 'beginner', 'flexibility', 'From plank, lift hips up and back, straighten legs, create inverted V shape', true);