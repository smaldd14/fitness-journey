import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Dumbbell } from 'lucide-react';
import { Exercise } from '@/types/exercise';
import { useAuthStore } from '@/stores/authStore';

interface ExerciseCardProps {
  exercise: Exercise;
  onView?: (exercise: Exercise) => void;
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exercise: Exercise) => void;
  showActions?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onView,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const { user } = useAuthStore();
  const canEdit = user?.id === exercise.created_by;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Dumbbell className="w-4 h-4" />;
      case 'cardio': return '💓';
      case 'flexibility': return '🧘';
      default: return <Dumbbell className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{exercise.name}</CardTitle>
          <div className="flex items-center gap-1 text-gray-500">
            {getTypeIcon(exercise.exercise_type)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(exercise.difficulty_level)}>
            {exercise.difficulty_level}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {exercise.exercise_type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {exercise.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {exercise.description}
          </p>
        )}

        {/* Muscle Groups */}
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Target Muscles:</p>
          <div className="flex flex-wrap gap-1">
            {exercise.muscle_groups.slice(0, 3).map((muscle) => (
              <Badge 
                key={muscle} 
                variant="secondary" 
                className="text-xs"
              >
                {muscle}
              </Badge>
            ))}
            {exercise.muscle_groups.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{exercise.muscle_groups.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Equipment */}
        {exercise.equipment_needed.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Equipment:</p>
            <div className="flex flex-wrap gap-1">
              {exercise.equipment_needed.slice(0, 2).map((equipment) => (
                <Badge 
                  key={equipment} 
                  variant="outline" 
                  className="text-xs"
                >
                  {equipment}
                </Badge>
              ))}
              {exercise.equipment_needed.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{exercise.equipment_needed.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(exercise)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(exercise)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(exercise)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};