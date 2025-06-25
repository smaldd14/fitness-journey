import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ExerciseForm } from './ExerciseForm';
import { useExerciseStore } from '@/stores/exerciseStore';
import { Exercise, CreateExerciseInput, UpdateExerciseInput } from '@/types/exercise';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: Exercise; // If provided, we're editing
}

export const ExerciseDialog: React.FC<ExerciseDialogProps> = ({
  open,
  onOpenChange,
  exercise
}) => {
  const { createExercise, updateExercise, loading } = useExerciseStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSubmit = async (data: CreateExerciseInput | UpdateExerciseInput) => {
    try {
      if (exercise) {
        // Editing existing exercise
        await updateExercise(data as UpdateExerciseInput);
        toast.success('Exercise updated successfully!');
      } else {
        // Creating new exercise
        await createExercise(data as CreateExerciseInput);
        toast.success('Exercise created successfully!');
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save exercise:', error);
      toast.error(exercise ? 'Failed to update exercise' : 'Failed to create exercise');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const title = exercise ? 'Edit Exercise' : 'Create New Exercise';

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ExerciseForm
            exercise={exercise}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <ExerciseForm
            exercise={exercise}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};