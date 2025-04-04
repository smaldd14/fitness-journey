// Types for workout categories
export type WorkoutDay = 
  | 'Monday: Upper Body Push' 
  | 'Tuesday: Cardio + Abs' 
  | 'Wednesday: Lower Body' 
  | 'Thursday: Cardio + Abs' 
  | 'Friday: Upper Body Pull' 
  | 'Saturday: Full Body';

// Exercise details
export interface Exercise {
  // Basics
  name: string;
  sets: number;
  reps: number;
  
  // Optional properties based on exercise type
  weight?: number;     // Weight in lbs or kg
  distance?: number;   // Distance in miles or km
  duration?: number;   // Duration in seconds
  restTime?: number;   // Rest time in seconds between sets
  tempo?: string;      // Tempo notation (e.g., "3-1-3" for eccentric-pause-concentric)
  notes?: string;      // Additional instructions or notes
}

// Represents a single workout section (e.g., "Warm-up" or "Main Workout")
export interface WorkoutSection {
  sectionName: string;  // e.g., "Warm-up", "Main Workout", "Cool Down"
  exercises: Exercise[];
}

// Full workout data for a specific date
export interface WorkoutData {
  // Date and identification
  date: string;         // In YYYY-MM-DD format
  dayOfWeek: WorkoutDay;
  workoutTime?: string; // Optional time of day for the workout (e.g., "08:00 AM")
  
  // Workout metadata
  title: string;        // Overall workout title/name
  focus: string;        // Main focus/goal of the workout
  duration: number;     // Total workout duration in seconds
  
  // The actual workout components
  sections: WorkoutSection[];
  
  // Overall tracking
  completionStatus: 'Completed' | 'Partial' | 'Skipped' | 'Planned';
  
  // For Strava integration
  stravaActivityType: string;  // e.g., "WeightTraining", "Run", "Ride"
  stravaDescription?: string;  // Description to use for Strava post
  
  // Notes and measurements
  notes?: string;       // General notes about the workout
}

// Interface for Google Sheets cell parameters
export interface SheetCellParams {
  workoutDay: WorkoutDay;
  startCell: string;
  exerciseCount: number;
  workoutTime?: string;
}

// Response interface for our extraction function
export interface WorkoutExtractResponse {
  success: boolean;
  data?: WorkoutData;
  error?: string;
}

// Response interface for the complete pipeline (extraction + posting)
export interface WorkoutPostResponse {
  success: boolean;
  data?: WorkoutData;
  stravaPostId?: number;
  stravaUrl?: string;
  error?: string;
}

// Map WorkoutDay to Strava activity type - this needs to be properly typed
export const workoutTypeMapping: Record<WorkoutDay, string> = {
  'Monday: Upper Body Push': 'WeightTraining',
  'Tuesday: Cardio + Abs': 'Workout',
  'Wednesday: Lower Body': 'WeightTraining',
  'Thursday: Cardio + Abs': 'Workout',
  'Friday: Upper Body Pull': 'WeightTraining',
  'Saturday: Full Body': 'WeightTraining'
};