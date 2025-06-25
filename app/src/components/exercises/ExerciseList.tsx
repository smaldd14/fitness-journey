import React, { useEffect } from 'react';
import { ExerciseCard } from './ExerciseCard';
import { useExerciseStore } from '@/stores/exerciseStore';
import { Exercise, ExerciseFilters } from '@/types/exercise';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ExerciseListProps {
  filters?: ExerciseFilters;
  onCreateNew?: () => void;
  onViewExercise?: (exercise: Exercise) => void;
  onEditExercise?: (exercise: Exercise) => void;
  showCreateButton?: boolean;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  filters,
  onCreateNew,
  onViewExercise,
  onEditExercise,
  showCreateButton = true
}) => {
  const { 
    exercises, 
    loading, 
    error, 
    loadExercises, 
    deleteExercise,
    clearError 
  } = useExerciseStore();

  useEffect(() => {
    loadExercises(filters);
  }, [filters, loadExercises]);

  const handleDeleteExercise = async (exercise: Exercise) => {
    if (!confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
      return;
    }

    try {
      await deleteExercise(exercise.id);
      toast.success('Exercise deleted successfully');
    } catch (error) {
      console.error('Failed to delete exercise:', error);
      toast.error('Failed to delete exercise');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading exercises...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exercises</h2>
          <p className="text-gray-600">
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {showCreateButton && (
          <Button onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        )}
      </div>

      {/* Exercise Grid */}
      {exercises.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
          <p className="text-gray-500 mb-4">
            {filters?.search 
              ? 'Try adjusting your search criteria' 
              : 'Get started by adding your first exercise'
            }
          </p>
          {showCreateButton && (
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onView={onViewExercise}
              onEdit={onEditExercise}
              onDelete={handleDeleteExercise}
            />
          ))}
        </div>
      )}
    </div>
  );
};