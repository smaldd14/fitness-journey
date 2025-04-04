import React, { useState } from 'react';
import WorkoutSelector from './workout-selector';
import { extractAndPostWorkout } from '@/services/workoutToStravaService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import the types
type WorkoutDay =
  | 'Monday: Upper Body Push'
  | 'Tuesday: Cardio + Abs'
  | 'Wednesday: Lower Body'
  | 'Thursday: Cardio + Abs'
  | 'Friday: Upper Body Pull'
  | 'Saturday: Full Body';

// Interface for our workout data
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

// Interface for our result state
interface ResultState {
  success: boolean;
  data?: WorkoutData;
  stravaPostId?: number;
  stravaUrl?: string;
  error?: string;
}

const WorkoutStravaExtractor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [postToStrava, setPostToStrava] = useState(true);
  const [result, setResult] = useState<ResultState | null>(null);

  const handleExtractWorkout = async (
    workoutDay: WorkoutDay,
    startCell: string,
    exerciseCount: number
  ) => {
    setIsLoading(true);
    setResult(null);

    try {
      // Call the combined extract and post service
      const response = await extractAndPostWorkout(
        workoutDay,
        startCell,
        exerciseCount
      );

      setResult(response);
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Workout to Strava</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Extract Workout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <WorkoutSelector onSubmit={handleExtractWorkout} />
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="post-to-strava" 
                  checked={postToStrava}
                  onCheckedChange={setPostToStrava}
                />
                <Label htmlFor="post-to-strava">Post to Strava automatically</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
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
                      <AlertTitle className="text-green-700">Success</AlertTitle>
                      <AlertDescription className="text-green-600">
                        {result.stravaPostId 
                          ? 'Workout extracted and posted to Strava' 
                          : 'Workout data extracted successfully'}
                      </AlertDescription>
                    </Alert>
                    
                    {result.stravaUrl && (
                      <div className="mt-2">
                        <a 
                          href={result.stravaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:underline"
                        >
                          View on Strava <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    )}
                    
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

export default WorkoutStravaExtractor;