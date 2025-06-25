import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExerciseDetail } from '@/components/exercises/ExerciseDetail';
import { ExerciseDialog } from '@/components/exercises/ExerciseDialog';
import { useExerciseStore } from '@/stores/exerciseStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ExerciseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedExercise, loading, getExerciseById, deleteExercise } = useExerciseStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getExerciseById(id).catch((error) => {
        console.error('Failed to load exercise:', error);
        toast.error('Exercise not found');
        navigate('/exercises');
      });
    }
  }, [id, getExerciseById, navigate]);

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedExercise) return;

    if (!confirm(`Are you sure you want to delete "${selectedExercise.name}"?`)) {
      return;
    }

    try {
      await deleteExercise(selectedExercise.id);
      toast.success('Exercise deleted successfully');
      navigate('/exercises');
    } catch (error) {
      console.error('Failed to delete exercise:', error);
      toast.error('Failed to delete exercise');
    }
  };

  const handleBack = () => {
    navigate('/exercises');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading exercise...</span>
      </div>
    );
  }

  if (!selectedExercise) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Exercise not found</h2>
        <p className="text-gray-600 mb-4">The exercise you're looking for doesn't exist.</p>
        <button 
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to exercises
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <ExerciseDetail
          exercise={selectedExercise}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      </div>

      <ExerciseDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        exercise={selectedExercise}
      />
    </>
  );
};