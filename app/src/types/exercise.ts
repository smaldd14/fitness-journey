export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseType = 'strength' | 'cardio' | 'flexibility';

export type MuscleGroup = 
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms'
  | 'core' | 'abs' | 'obliques'
  | 'quadriceps' | 'hamstrings' | 'glutes' | 'calves' | 'legs'
  | 'cardiovascular' | 'full body' | 'hips';

export type Equipment = 
  | 'barbell' | 'dumbbells' | 'dumbbell' | 'kettlebell'
  | 'cable machine' | 'pull-up bar' | 'dip bars'
  | 'bench' | 'incline bench'
  | 'bike' | 'treadmill'
  | 'resistance bands' | 'medicine ball'
  | 'bodyweight' | 'none';

// Database Exercise entity
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_groups: MuscleGroup[];
  equipment_needed: Equipment[];
  difficulty_level: DifficultyLevel;
  exercise_type: ExerciseType;
  instructions?: string;
  created_by?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// For creating new exercises
export interface CreateExerciseInput {
  name: string;
  description?: string;
  muscle_groups: MuscleGroup[];
  equipment_needed: Equipment[];
  difficulty_level: DifficultyLevel;
  exercise_type: ExerciseType;
  instructions?: string;
  is_public?: boolean;
}

// For updating exercises
export interface UpdateExerciseInput extends Partial<CreateExerciseInput> {
  id: string;
}

// Exercise filters
export interface ExerciseFilters {
  search?: string;
  muscle_groups?: MuscleGroup[];
  equipment?: Equipment[];
  difficulty_level?: DifficultyLevel[];
  exercise_type?: ExerciseType[];
  created_by?: string;
  is_public?: boolean;
}

// Exercise categories for organization
export interface ExerciseCategory {
  name: string;
  muscle_groups: MuscleGroup[];
  color: string;
}

// Predefined exercise categories
export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    name: 'Chest',
    muscle_groups: ['chest'],
    color: 'bg-red-100 text-red-800'
  },
  {
    name: 'Back',
    muscle_groups: ['back'],
    color: 'bg-blue-100 text-blue-800'
  },
  {
    name: 'Shoulders',
    muscle_groups: ['shoulders'],
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    name: 'Arms',
    muscle_groups: ['biceps', 'triceps', 'forearms'],
    color: 'bg-purple-100 text-purple-800'
  },
  {
    name: 'Legs',
    muscle_groups: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    color: 'bg-green-100 text-green-800'
  },
  {
    name: 'Core',
    muscle_groups: ['core', 'abs', 'obliques'],
    color: 'bg-orange-100 text-orange-800'
  },
  {
    name: 'Cardio',
    muscle_groups: ['cardiovascular'],
    color: 'bg-pink-100 text-pink-800'
  },
  {
    name: 'Flexibility',
    muscle_groups: ['full body'],
    color: 'bg-indigo-100 text-indigo-800'
  }
];

// Equipment categories
export const EQUIPMENT_CATEGORIES = {
  'Free Weights': ['barbell', 'dumbbells', 'dumbbell', 'kettlebell'],
  'Machines': ['cable machine', 'bike', 'treadmill'],
  'Bodyweight': ['pull-up bar', 'dip bars', 'bench', 'incline bench'],
  'Accessories': ['resistance bands', 'medicine ball'],
  'No Equipment': ['bodyweight', 'none']
} as const;