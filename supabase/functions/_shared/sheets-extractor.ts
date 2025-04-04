import { google } from 'npm:googleapis@110.0.0';
import { WorkoutData, WorkoutExtractResponse, SheetCellParams, workoutTypeMapping, WorkoutDay, Exercise, WorkoutSection } from './types.ts';

/**
 * Extract workout data from Google Sheets
 */
export async function extractWorkoutFromSheets(
  params: SheetCellParams
): Promise<WorkoutExtractResponse> {
  try {
    const { workoutDay, startCell, exerciseCount } = params;
    
    // Calculate ranges
    const dateCell = startCell;
    const exerciseRange = calculateRange(startCell, 'B', exerciseCount);
    
    // Get Google Sheets credentials from environment variables
    const clientEmail = Deno.env.get('GOOGLE_CLIENT_EMAIL') || '';
    const privateKey = Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n') || '';
    const projectId = Deno.env.get('GOOGLE_PROJECT_ID') || '';
    const spreadsheetId = Deno.env.get('SPREADSHEET_ID') || '';
    
    if (!spreadsheetId || !privateKey || !clientEmail || !projectId) {
      throw new Error('Missing required Google Sheets environment variables');
    }
    
    console.log(`Using Google service account: ${clientEmail} for project: ${projectId}`);
    
    // Create JWT client
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    
    // Create Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get date from the specified cell
    const dateResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${workoutDay}!${dateCell}`
    });
    
    if (!dateResponse.data.values || dateResponse.data.values.length === 0) {
      throw new Error(`No date found in cell ${dateCell}`);
    }
    
    const dateValue = dateResponse.data.values[0][0];
    console.log(`Raw date value from spreadsheet: ${dateValue}`);
    
    // Get exercises from the specified range
    const exercisesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${workoutDay}!${exerciseRange}`
    });
    
    if (!exercisesResponse.data.values || exercisesResponse.data.values.length === 0) {
      throw new Error(`No exercises found in range ${exerciseRange}`);
    }
    
    // Get sets from C column
    const setsRange = calculateRange(startCell, 'C', exerciseCount);
    const setsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${workoutDay}!${setsRange}`
    });
    
    // Get reps from I column
    const repsRange = calculateRange(startCell, 'I', exerciseCount);
    const repsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${workoutDay}!${repsRange}`
    });
    
    // Extract data
    const exercises = exercisesResponse.data.values.map(row => row[0]).filter(Boolean);
    const sets = setsResponse.data.values ? setsResponse.data.values.map(row => row[0] || '0') : [];
    const reps = repsResponse.data.values ? repsResponse.data.values.map(row => row[0] || '0') : [];
    
    console.log('Extracted data:', { exercises, sets, reps });
    
    // Create workout data
    const workoutData = createWorkoutFromCells(
      dateValue,
      exercises,
      sets,
      reps,
      workoutDay
    );
    
    console.log(`Formatted date: ${workoutData.date}`);
    
    return {
      success: true,
      data: workoutData
    };
    
  } catch (error: any) {
    console.error('Error extracting workout data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Convert a cell reference (e.g., "A71") and a count to a range (e.g., "B71:B76")
 */
function calculateRange(startCell: string, column: string, count: number): string {
  // Extract row number from the start cell
  const rowMatch = startCell.match(/[A-Za-z]+(\d+)/);
  if (!rowMatch) return '';
  
  const startRow = parseInt(rowMatch[1]);
  const endRow = startRow + count - 1;
  
  return `${column}${startRow}:${column}${endRow}`;
}

/**
 * Create workout data from extracted cell values
 */
function createWorkoutFromCells(
  dateValue: string,
  exercises: string[],
  sets: string[],
  reps: string[],
  workoutDay: string
): WorkoutData {
  // Ensure workoutDay is a valid WorkoutDay type
  const typedWorkoutDay = workoutDay as WorkoutDay;
  
  // Create the workoutData object with proper typing
  const workoutData: WorkoutData = {
    date: formatDateForStrava(dateValue),
    dayOfWeek: typedWorkoutDay,
    title: `${extractFocus(workoutDay)} Workout`,
    focus: extractFocus(workoutDay),
    duration: 3600, // Default to 1 hour (3600 seconds)
    sections: [],
    completionStatus: 'Completed',
    stravaActivityType: workoutTypeMapping[typedWorkoutDay] || 'Workout'
  };
  
  // Create a single section with all exercises
  const mainSection: WorkoutSection = {
    sectionName: 'Main Workout',
    exercises: []
  };
  
  // Add each exercise to the section with proper typing
  exercises.forEach((exerciseName, index) => {
    if (exerciseName) {
      const exercise: Exercise = {
        name: exerciseName,
        sets: sets[index] ? parseInt(sets[index], 10) || 0 : 0,
        reps: reps[index] ? calculateAverageReps(reps[index]) : 0
      };
      
      mainSection.exercises.push(exercise);
    }
  });
  
  workoutData.sections = [mainSection];
  
  return workoutData;
}

/**
 * Extract the main focus from the sheet name
 */
function extractFocus(sheetName: string): string {
  return sheetName.split(':')[1]?.trim() || sheetName;
}

/**
 * Calculate average reps from a string like "10,9,9" or "12"
 */
function calculateAverageReps(repsStr: string): number {
  if (!repsStr || repsStr.trim() === '') {
    return 0;
  }
  
  // Handle case where it's just a single number
  if (!repsStr.includes(',')) {
    const num = Number(repsStr.trim());
    return isNaN(num) ? 0 : num;
  }
  
  // Handle comma-separated values
  const repValues = repsStr.split(',')
    .map(rep => rep.trim())
    .map(rep => Number(rep))
    .filter(rep => !isNaN(rep));
  
  if (repValues.length === 0) {
    return 0;
  }
  
  const sum = repValues.reduce((total, val) => total + val, 0);
  return Math.round(sum / repValues.length);
}

/**
 * Format date for Strava (YYYY-MM-DD)
 */
function formatDateForStrava(dateStr: string): string {
  try {
    // Check if it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Handle short date format without year (e.g., "3/24")
    if (/^\d{1,2}\/\d{1,2}$/.test(dateStr)) {
      const parts = dateStr.split('/');
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = '2025'; // Hardcode the year to 2025
      return `${year}-${month}-${day}`;
    }
    
    // If it's in MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const parts = dateStr.split('/');
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    
    // Try to parse using Date constructor - but set the year explicitly to 2025
    // for partial dates
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      // If the year is 2001 (which happens for formats like MM/DD), change to 2025
      if (date.getFullYear() === 2001) {
        date.setFullYear(2025);
      }
      return date.toISOString().split('T')[0];
    }
    
    console.log(`Warning: Could not properly format date "${dateStr}", using as-is`);
    return dateStr;
  } catch (e) {
    console.error(`Error formatting date "${dateStr}":`, e);
    return dateStr;
  }
}