import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Import the workout day type from your types file
type WorkoutDay =
  | 'Monday: Upper Body Push'
  | 'Tuesday: Cardio + Abs'
  | 'Wednesday: Lower Body'
  | 'Thursday: Cardio + Abs'
  | 'Friday: Upper Body Pull'
  | 'Saturday: Full Body';

// Workout type mapping from the original file
const workoutTypeMapping: Record<WorkoutDay, string> = {
  'Monday: Upper Body Push': 'WeightTraining',
  'Tuesday: Cardio + Abs': 'Workout',
  'Wednesday: Lower Body': 'WeightTraining',
  'Thursday: Cardio + Abs': 'Workout',
  'Friday: Upper Body Pull': 'WeightTraining',
  'Saturday: Full Body': 'WeightTraining'
};

interface WorkoutSelectorProps {
  onSubmit: (workoutDay: WorkoutDay, startCell: string, exerciseCount: number, workoutTime: string) => void;
  buttonText?: string;
  headerText?: string;
  description?: string;
}

const WorkoutSelector: React.FC<WorkoutSelectorProps> = ({ 
  onSubmit, 
  buttonText = "Extract Workout Data",
  headerText = "Workout Data Extractor",
  description = "Specify workout type and starting cell to extract data"
}) => {
  const [workoutDay, setWorkoutDay] = useState<WorkoutDay>('Monday: Upper Body Push');
  const [startCell, setStartCell] = useState<string>('A71');
  const [exerciseCount, setExerciseCount] = useState<number>(6);
  const [workoutTime, setWorkoutTime] = useState<string>('');

  // Set default time to current time when component loads
  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setWorkoutTime(`${hours}:${minutes}`);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(workoutDay, startCell, exerciseCount, workoutTime);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{headerText}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="workout-type">Workout Type</Label>
            <Select
              value={workoutDay}
              onValueChange={(value) => setWorkoutDay(value as WorkoutDay)}
            >
              <SelectTrigger id="workout-type" className="w-full">
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(workoutTypeMapping).map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Strava activity type: {workoutTypeMapping[workoutDay]}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-cell">Starting Cell</Label>
            <Input
              id="start-cell"
              placeholder="e.g. A71"
              value={startCell}
              onChange={(e) => setStartCell(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              First cell of the workout section (contains the date)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise-count">Number of Exercises</Label>
            <Input
              id="exercise-count"
              type="number"
              min="1"
              max="20"
              placeholder="e.g. 6"
              value={exerciseCount}
              onChange={(e) => setExerciseCount(parseInt(e.target.value) || 0)}
            />
            <p className="text-sm text-muted-foreground">
              How many exercise rows to extract
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workout-time">Workout Time</Label>
            <Input
              id="workout-time"
              type="time"
              value={workoutTime}
              onChange={(e) => setWorkoutTime(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Time of day when workout was performed (defaults to current time)
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">{buttonText}</Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutSelector;