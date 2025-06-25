import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { 
  ExerciseFilters as ExerciseFiltersType, 
  EXERCISE_CATEGORIES,
  EQUIPMENT_CATEGORIES,
  DifficultyLevel,
  ExerciseType 
} from '@/types/exercise';

interface ExerciseFiltersProps {
  filters: ExerciseFiltersType;
  onFiltersChange: (filters: ExerciseFiltersType) => void;
  onSearch: (searchTerm: string) => void;
}

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const toggleMuscleGroup = (muscleGroup: string) => {
    const current = filters.muscle_groups || [];
    const updated = current.includes(muscleGroup as any)
      ? current.filter(mg => mg !== muscleGroup)
      : [...current, muscleGroup as any];
    
    onFiltersChange({ ...filters, muscle_groups: updated });
  };

  const toggleEquipment = (equipment: string) => {
    const current = filters.equipment || [];
    const updated = current.includes(equipment as any)
      ? current.filter(eq => eq !== equipment)
      : [...current, equipment as any];
    
    onFiltersChange({ ...filters, equipment: updated });
  };

  const toggleDifficulty = (difficulty: DifficultyLevel) => {
    const current = filters.difficulty_level || [];
    const updated = current.includes(difficulty)
      ? current.filter(d => d !== difficulty)
      : [...current, difficulty];
    
    onFiltersChange({ ...filters, difficulty_level: updated });
  };

  const toggleExerciseType = (type: ExerciseType) => {
    const current = filters.exercise_type || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    
    onFiltersChange({ ...filters, exercise_type: updated });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="w-4 h-4 mr-1" />
              {showAdvanced ? 'Simple' : 'Advanced'}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Exercise Type */}
            <div>
              <Label className="text-sm font-medium">Exercise Type</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(['strength', 'cardio', 'flexibility'] as ExerciseType[]).map((type) => (
                  <Badge
                    key={type}
                    variant={filters.exercise_type?.includes(type) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleExerciseType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <Label className="text-sm font-medium">Difficulty Level</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((level) => (
                  <Badge
                    key={level}
                    variant={filters.difficulty_level?.includes(level) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleDifficulty(level)}
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Muscle Groups */}
            <div>
              <Label className="text-sm font-medium">Muscle Groups</Label>
              <div className="space-y-2 mt-2">
                {EXERCISE_CATEGORIES.map((category) => (
                  <div key={category.name}>
                    <p className="text-xs font-medium text-gray-600 mb-1">{category.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {category.muscle_groups.map((muscle) => (
                        <Badge
                          key={muscle}
                          variant={filters.muscle_groups?.includes(muscle) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-gray-100 text-xs"
                          onClick={() => toggleMuscleGroup(muscle)}
                        >
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <Label className="text-sm font-medium">Equipment</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(EQUIPMENT_CATEGORIES).map(([category, equipment]) => (
                  <div key={category}>
                    <p className="text-xs font-medium text-gray-600 mb-1">{category}</p>
                    <div className="flex flex-wrap gap-1">
                      {equipment.map((item) => (
                        <Badge
                          key={item}
                          variant={filters.equipment?.includes(item as any) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-gray-100 text-xs"
                          onClick={() => toggleEquipment(item)}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium">Active Filters:</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: {filters.search}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => {
                      setSearchTerm('');
                      onFiltersChange({ ...filters, search: undefined });
                    }}
                  />
                </Badge>
              )}
              {filters.exercise_type?.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleExerciseType(type)}
                  />
                </Badge>
              ))}
              {filters.difficulty_level?.map(level => (
                <Badge key={level} variant="secondary" className="text-xs">
                  {level}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleDifficulty(level)}
                  />
                </Badge>
              ))}
              {filters.muscle_groups?.map(muscle => (
                <Badge key={muscle} variant="secondary" className="text-xs">
                  {muscle}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleMuscleGroup(muscle)}
                  />
                </Badge>
              ))}
              {filters.equipment?.map(equipment => (
                <Badge key={equipment} variant="secondary" className="text-xs">
                  {equipment}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleEquipment(equipment)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};