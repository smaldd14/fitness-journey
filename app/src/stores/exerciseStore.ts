import { create } from 'zustand';
import { Exercise, ExerciseFilters, CreateExerciseInput, UpdateExerciseInput } from '@/types/exercise';
import { ExerciseService } from '@/services/exerciseService';

interface ExerciseState {
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  filters: ExerciseFilters;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadExercises: (filters?: ExerciseFilters) => Promise<void>;
  createExercise: (input: CreateExerciseInput) => Promise<Exercise>;
  updateExercise: (input: UpdateExerciseInput) => Promise<Exercise>;
  deleteExercise: (id: string) => Promise<void>;
  getExerciseById: (id: string) => Promise<Exercise | null>;
  searchExercises: (searchTerm: string) => Promise<void>;
  setFilters: (filters: ExerciseFilters) => void;
  setSelectedExercise: (exercise: Exercise | null) => void;
  clearError: () => void;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  selectedExercise: null,
  filters: {},
  loading: false,
  error: null,

  loadExercises: async (filters?: ExerciseFilters) => {
    try {
      set({ loading: true, error: null });
      
      const filtersToUse = filters || get().filters;
      const exercises = await ExerciseService.getExercises(filtersToUse);
      
      set({ 
        exercises, 
        filters: filtersToUse,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load exercises',
        loading: false 
      });
      throw error;
    }
  },

  createExercise: async (input: CreateExerciseInput) => {
    try {
      set({ loading: true, error: null });
      
      const newExercise = await ExerciseService.createExercise(input);
      
      set(state => ({ 
        exercises: [newExercise, ...state.exercises],
        loading: false 
      }));
      
      return newExercise;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create exercise',
        loading: false 
      });
      throw error;
    }
  },

  updateExercise: async (input: UpdateExerciseInput) => {
    try {
      set({ loading: true, error: null });
      
      const updatedExercise = await ExerciseService.updateExercise(input);
      
      set(state => ({ 
        exercises: state.exercises.map(ex => 
          ex.id === updatedExercise.id ? updatedExercise : ex
        ),
        selectedExercise: state.selectedExercise?.id === updatedExercise.id 
          ? updatedExercise 
          : state.selectedExercise,
        loading: false 
      }));
      
      return updatedExercise;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update exercise',
        loading: false 
      });
      throw error;
    }
  },

  deleteExercise: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      await ExerciseService.deleteExercise(id);
      
      set(state => ({ 
        exercises: state.exercises.filter(ex => ex.id !== id),
        selectedExercise: state.selectedExercise?.id === id 
          ? null 
          : state.selectedExercise,
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete exercise',
        loading: false 
      });
      throw error;
    }
  },

  getExerciseById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      // First check if it's already in our store
      const existing = get().exercises.find(ex => ex.id === id);
      if (existing) {
        set({ selectedExercise: existing, loading: false });
        return existing;
      }
      
      // Otherwise fetch from API
      const exercise = await ExerciseService.getExerciseById(id);
      
      set({ 
        selectedExercise: exercise,
        loading: false 
      });
      
      return exercise;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load exercise',
        loading: false 
      });
      throw error;
    }
  },

  searchExercises: async (searchTerm: string) => {
    try {
      set({ loading: true, error: null });
      
      const exercises = await ExerciseService.searchExercises(searchTerm);
      
      set({ 
        exercises,
        filters: { ...get().filters, search: searchTerm },
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search exercises',
        loading: false 
      });
      throw error;
    }
  },

  setFilters: (filters: ExerciseFilters) => {
    set({ filters });
    // Automatically reload exercises with new filters
    get().loadExercises(filters);
  },

  setSelectedExercise: (exercise: Exercise | null) => {
    set({ selectedExercise: exercise });
  },

  clearError: () => {
    set({ error: null });
  }
}));