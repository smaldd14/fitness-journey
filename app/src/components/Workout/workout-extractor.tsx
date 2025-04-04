import React, { useState } from 'react';
import WorkoutSelector from './workout-selector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from 'lucide-react';
import { extractWorkoutData } from '@/services/workoutService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import the types from your types file
type WorkoutDay =
  | 'Monday: Upper Body Push'
  | 'Tuesday: Cardio + Abs'
  | 'Wednesday: Lower Body'
  | 'Thursday: Cardio + Abs'
  | 'Friday: Upper Body Pull'
  | 'Saturday: Full Body';

// This is a simplified version of your WorkoutData type
interface WorkoutData {
  date: string;
  dayOfWeek: WorkoutDay;
  title: string;
  focus: string;
  duration: number;
  sections: Array<{
    sectionName: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
    }>;
  }>;
  completionStatus: string;
  stravaActivityType: string;
}

const WorkoutExtractorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    data?: WorkoutData;
    error?: string;
  } | null>(null);

  const handleExtractWorkout = async (
    workoutDay: WorkoutDay,
    startCell: string,
    exerciseCount: number
  ) => {
    setIsLoading(true);
    setResult(null);

    try {
      const workoutData = await extractWorkoutData(
        workoutDay,
        startCell,
        exerciseCount
      );
      console.log("got workoutData", workoutData);

      setResult({
        success: true,
        data: workoutData
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <WorkoutSelector 
            onSubmit={handleExtractWorkout} 
            buttonText="Preview Workout Data Only"
            headerText="Extract for Preview"
            description="Extract workout data from your Google Sheet for preview before posting to Strava"
          />
        </div>
        
        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Workout Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-t-primary rounded-full"></div>
                </div>
              ) : result ? (
                result.success ? (
                  <div className="space-y-4">
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <AlertTitle className="text-green-700">Preview Ready</AlertTitle>
                      <AlertDescription className="text-green-600">
                        Workout data extracted successfully (not posted to Strava)
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-4 border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{result.data?.title}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Date:</div>
                        <div className="font-medium">{result.data?.date}</div>

                        <div>Focus:</div>
                        <div className="font-medium">{result.data?.focus}</div>
                        
                        <div>Activity Type:</div>
                        <div className="font-medium">{result.data?.stravaActivityType}</div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Exercises:</h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Exercise</TableHead>
                                <TableHead className="text-center">Sets</TableHead>
                                <TableHead className="text-center">Avg. Reps</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {result.data?.sections[0]?.exercises.map((exercise, index) => (
                                <TableRow key={index}>
                                  <TableCell>{exercise.name}</TableCell>
                                  <TableCell className="text-center">{exercise.sets}</TableCell>
                                  <TableCell className="text-center">{exercise.reps}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {result.error || 'Failed to extract workout data'}
                    </AlertDescription>
                  </Alert>
                )
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  Select workout type and starting cell, then click "Extract Workout Data"
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkoutExtractorPage;