import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, ArrowLeft, Dumbbell, Clock, Target, Wrench } from 'lucide-react';
import { Exercise } from '@/types/exercise';
import { useAuthStore } from '@/stores/authStore';

interface ExerciseDetailProps {
  exercise: Exercise;
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exercise: Exercise) => void;
  onBack?: () => void;
  showActions?: boolean;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = ({
  exercise,
  onEdit,
  onDelete,
  onBack,
  showActions = true
}) => {
  const { user } = useAuthStore();
  const canEdit = user?.id === exercise.created_by;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cardio': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'flexibility': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">{exercise.name}</h1>
            <p className="text-gray-600">
              Created on {formatDate(exercise.created_at)}
            </p>
          </div>
        </div>

        {showActions && canEdit && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit?.(exercise)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDelete?.(exercise)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Exercise Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type and Difficulty */}
              <div className="flex gap-2">
                <Badge className={getTypeColor(exercise.exercise_type)}>
                  {exercise.exercise_type}
                </Badge>
                <Badge className={getDifficultyColor(exercise.difficulty_level)}>
                  {exercise.difficulty_level}
                </Badge>
                {!exercise.is_public && (
                  <Badge variant="outline">Private</Badge>
                )}
              </div>

              {/* Description */}
              {exercise.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{exercise.description}</p>
                </div>
              )}

              {/* Instructions */}
              {exercise.instructions && (
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {exercise.instructions}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Target Muscles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Target Muscles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exercise.muscle_groups.map((muscle) => (
                  <Badge key={muscle} variant="secondary">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Equipment Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exercise.equipment_needed.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment_needed.map((equipment) => (
                    <Badge key={equipment} variant="outline">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No equipment needed</p>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <Badge className={getTypeColor(exercise.exercise_type)}>
                  {exercise.exercise_type}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Difficulty:</span>
                <Badge className={getDifficultyColor(exercise.difficulty_level)}>
                  {exercise.difficulty_level}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Visibility:</span>
                <Badge variant={exercise.is_public ? "default" : "outline"}>
                  {exercise.is_public ? "Public" : "Private"}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="text-xs text-gray-500">
                <p>Created: {formatDate(exercise.created_at)}</p>
                <p>Updated: {formatDate(exercise.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};