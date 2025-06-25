import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';
import { 
  Exercise, 
  CreateExerciseInput, 
  UpdateExerciseInput,
  DifficultyLevel,
  ExerciseType,
  MuscleGroup,
  Equipment,
  EXERCISE_CATEGORIES,
  EQUIPMENT_CATEGORIES
} from '@/types/exercise';

interface ExerciseFormProps {
  exercise?: Exercise; // If provided, we're editing
  onSubmit: (data: CreateExerciseInput | UpdateExerciseInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exercise,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    description: exercise?.description || '',
    instructions: exercise?.instructions || '',
    difficulty_level: exercise?.difficulty_level || 'beginner' as DifficultyLevel,
    exercise_type: exercise?.exercise_type || 'strength' as ExerciseType,
    muscle_groups: exercise?.muscle_groups || [] as MuscleGroup[],
    equipment_needed: exercise?.equipment_needed || [] as Equipment[],
    is_public: exercise?.is_public ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Exercise name is required';
    if (formData.muscle_groups.length === 0) newErrors.muscle_groups = 'At least one muscle group is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (exercise) {
        // Editing existing exercise
        await onSubmit({
          id: exercise.id,
          ...formData
        } as UpdateExerciseInput);
      } else {
        // Creating new exercise
        await onSubmit(formData as CreateExerciseInput);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    setFormData(prev => ({
      ...prev,
      muscle_groups: prev.muscle_groups.includes(muscleGroup)
        ? prev.muscle_groups.filter(mg => mg !== muscleGroup)
        : [...prev.muscle_groups, muscleGroup]
    }));
  };

  const toggleEquipment = (equipment: Equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment_needed: prev.equipment_needed.includes(equipment)
        ? prev.equipment_needed.filter(eq => eq !== equipment)
        : [...prev.equipment_needed, equipment]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Exercise Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Push-up, Bench Press"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the exercise"
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Step-by-step instructions on how to perform this exercise"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exercise Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Exercise Type</Label>
              <Select 
                value={formData.exercise_type} 
                onValueChange={(value: ExerciseType) => 
                  setFormData(prev => ({ ...prev, exercise_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Difficulty Level</Label>
              <Select 
                value={formData.difficulty_level} 
                onValueChange={(value: DifficultyLevel) => 
                  setFormData(prev => ({ ...prev, difficulty_level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_public: checked }))
              }
            />
            <Label htmlFor="is_public">Make this exercise public</Label>
          </div>
        </CardContent>
      </Card>

      {/* Muscle Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Target Muscle Groups *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {EXERCISE_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h4 className="font-medium text-sm mb-2">{category.name}</h4>
              <div className="flex flex-wrap gap-2">
                {category.muscle_groups.map((muscle) => (
                  <Badge
                    key={muscle}
                    variant={formData.muscle_groups.includes(muscle) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleMuscleGroup(muscle)}
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {errors.muscle_groups && (
            <p className="text-sm text-red-600">{errors.muscle_groups}</p>
          )}
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Needed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(EQUIPMENT_CATEGORIES).map(([categoryName, equipment]) => (
            <div key={categoryName}>
              <h4 className="font-medium text-sm mb-2">{categoryName}</h4>
              <div className="flex flex-wrap gap-2">
                {equipment.map((item) => (
                  <Badge
                    key={item}
                    variant={formData.equipment_needed.includes(item as Equipment) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleEquipment(item as Equipment)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : exercise ? 'Update Exercise' : 'Create Exercise'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};