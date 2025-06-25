import supabase from '@/db/supabase';
import { 
  Exercise, 
  CreateExerciseInput, 
  UpdateExerciseInput, 
  ExerciseFilters 
} from '@/types/exercise';

export class ExerciseService {
  // Get all exercises with optional filtering
  static async getExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
    try {
      let query = supabase
        .from('exercises')
        .select('*')
        .order('name');

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.muscle_groups?.length) {
        query = query.overlaps('muscle_groups', filters.muscle_groups);
      }

      if (filters?.equipment?.length) {
        query = query.overlaps('equipment_needed', filters.equipment);
      }

      if (filters?.difficulty_level?.length) {
        query = query.in('difficulty_level', filters.difficulty_level);
      }

      if (filters?.exercise_type?.length) {
        query = query.in('exercise_type', filters.exercise_type);
      }

      if (filters?.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      if (filters?.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }

  // Get exercise by ID
  static async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching exercise:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }

  // Create new exercise
  static async createExercise(input: CreateExerciseInput): Promise<Exercise> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert({
          ...input,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating exercise:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }

  // Update exercise
  static async updateExercise(input: UpdateExerciseInput): Promise<Exercise> {
    try {
      const { id, ...updateData } = input;
      
      const { data, error } = await supabase
        .from('exercises')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating exercise:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }

  // Delete exercise
  static async deleteExercise(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting exercise:', error);
        throw error;
      }
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }

  // Get exercises by category (muscle group)
  static async getExercisesByCategory(muscleGroups: string[]): Promise<Exercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .overlaps('muscle_groups', muscleGroups)
        .order('name');

      if (error) {
        console.error('Error fetching exercises by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }

  // Get user's favorite exercises (you might add a favorites table later)
  static async getUserExercises(userId: string): Promise<Exercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user exercises:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }

  // Search exercises with advanced text search
  static async searchExercises(searchTerm: string): Promise<Exercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or(
          `name.ilike.%${searchTerm}%,` +
          `description.ilike.%${searchTerm}%,` +
          `instructions.ilike.%${searchTerm}%`
        )
        .order('name');

      if (error) {
        console.error('Error searching exercises:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Exercise service error:', error);
      throw error;
    }
  }
}