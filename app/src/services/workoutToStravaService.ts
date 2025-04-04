// src/services/workoutToStravaService.ts
import supabase from "@/db/supabase";

// Workout types from your types file
type WorkoutDay =
  | 'Monday: Upper Body Push'
  | 'Tuesday: Cardio + Abs'
  | 'Wednesday: Lower Body'
  | 'Thursday: Cardio + Abs'
  | 'Friday: Upper Body Pull'
  | 'Saturday: Full Body';

// Response interface matching the edge function
interface WorkoutPostResponse {
  success: boolean;
  data?: any;
  stravaPostId?: number;
  stravaUrl?: string;
  error?: string;
}

/**
 * Extract workout data from Google Sheets and post to Strava
 */
export const extractAndPostWorkout = async (
  workoutDay: WorkoutDay,
  startCell: string,
  exerciseCount: number,
  workoutTime?: string
): Promise<WorkoutPostResponse> => {
  try {
    console.log('Calling workout-to-strava edge function...');
    
    const { data, error } = await supabase.functions.invoke('workout-to-strava', {
      method: 'POST',
      body: {
        workoutDay,
        startCell,
        exerciseCount,
        workoutTime: workoutTime || null // Include workoutTime parameter
      },
    });

    if (error) throw error;
    
    return data as WorkoutPostResponse;
  } catch (error) {
    console.error('Extract and post workout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};