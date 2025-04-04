// src/services/workoutService.ts
import supabase from "@/db/supabase";

// Workout types - copy from your types file
type WorkoutDay =
  | 'Monday: Upper Body Push'
  | 'Tuesday: Cardio + Abs'
  | 'Wednesday: Lower Body'
  | 'Thursday: Cardio + Abs'
  | 'Friday: Upper Body Pull'
  | 'Saturday: Full Body';

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

// Convert a cell reference (e.g., "A71") and a count to a range (e.g., "B71:B76")
// function calculateRange(startCell: string, column: string, count: number): string {
//   // Extract row number from the start cell
//   const rowMatch = startCell.match(/[A-Za-z]+(\d+)/);
//   if (!rowMatch) return '';
  
//   const startRow = parseInt(rowMatch[1]);
//   const endRow = startRow + count - 1;
  
//   return `${column}${startRow}:${column}${endRow}`;
// }

export const extractWorkoutData = async (
  workoutDay: WorkoutDay,
  startCell: string,
  exerciseCount: number
): Promise<WorkoutData> => {
  try {
    // Calculate the ranges based on the start cell and count
    const dateCell = startCell; // Date is in column A (the start cell)
    // const exerciseRange = calculateRange(startCell, 'B', exerciseCount); // Exercises in column B
    const body = {
        workoutDay,
        startCell: dateCell,
        exerciseCount
    };
    console.log("body", body);
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('extract-workout', {
      method: 'POST',
      body: body,
    });

    console.log('Extract workout response:', data, error);

    if (error) throw error;
    return data.data as WorkoutData;
  } catch (error) {
    console.error('Extract workout error:', error);
    throw error;
  }
};