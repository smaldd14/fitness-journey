import React, { useState } from 'react';
import { ExerciseList } from '@/components/exercises/ExerciseList';
import { ExerciseFilters } from '@/components/exercises/ExerciseFilters';
import { ExerciseDialog } from '@/components/exercises/ExerciseDialog';
import { useExerciseStore } from '@/stores/exerciseStore';
import { Exercise } from '@/types/exercise';
import { useNavigate } from 'react-router-dom';

export const ExercisesPage: React.FC = () => {
  const navigate = useNavigate();
  const { filters, setFilters, searchExercises } = useExerciseStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();

  const handleCreateNew = () => {
    setEditingExercise(undefined);
    setDialogOpen(true);
  };

  const handleViewExercise = (exercise: Exercise) => {
    navigate(`/exercises/${exercise.id}`);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setDialogOpen(true);
  };

  const handleSearch = (searchTerm: string) => {
    searchExercises(searchTerm);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingExercise(undefined);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <ExerciseFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
        />
        
        <ExerciseList
          filters={filters}
          onCreateNew={handleCreateNew}
          onViewExercise={handleViewExercise}
          onEditExercise={handleEditExercise}
        />
      </div>

      <ExerciseDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        exercise={editingExercise}
      />
    </>
  );
};