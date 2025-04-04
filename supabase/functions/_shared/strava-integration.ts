import { getStravaAccessToken, StravaCredentials } from './strava-auth.ts';
import { WorkoutData } from './types.ts';

/**
 * Interface for a Strava activity payload
 */
interface StravaActivityPayload {
  name: string;
  type: string;
  sport_type: string;
  start_date_local: string;
  elapsed_time: number;
  description: string;
  distance?: number;
  trainer: number;
  commute: number;
}

/**
 * Interface for Strava API response
 */
export interface StravaPostResponse {
  success: boolean;
  stravaId?: number;
  error?: string;
  url?: string;
}

/**
 * Post workout data to Strava as an activity
 */
export async function postWorkoutToStrava(
  workout: WorkoutData,
  credentials: StravaCredentials
): Promise<StravaPostResponse> {
  try {
    // Get access token
    const accessToken = await getStravaAccessToken(credentials);
    
    // Create activity payload
    const payload = createStravaPayload(workout);
    
    console.log(`Posting "${payload.name}" to Strava...`);
    
    // Post to Strava API
    const response = await fetch('https://www.strava.com/api/v3/activities', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json() as any;
      throw new Error(`Strava API error: ${errorData.message || response.statusText}`);
    }
    
    // Parse the response
    const stravaActivity = await response.json() as any;
    
    console.log(`Successfully posted to Strava! Activity ID: ${stravaActivity.id}`);
    
    return {
      success: true,
      stravaId: stravaActivity.id,
      url: `https://www.strava.com/activities/${stravaActivity.id}`
    };
    
  } catch (error: any) {
    console.error('Error posting to Strava:', error);
    return {
      success: false,
      error: `Failed to post to Strava: ${error.message}`
    };
  }
}

/**
 * Create a Strava-compatible payload from workout data
 */
function createStravaPayload(workout: WorkoutData): StravaActivityPayload {
  // Format the date with time for Strava
  let startDateTime = '';
  
  if (workout.workoutTime) {
    // Use the provided workout time from the UI
    const [hours, minutes] = workout.workoutTime.split(':');
    startDateTime = `${workout.date}T${hours}:${minutes}:00`;
  } else {
    // Default to current time if no time provided
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    startDateTime = `${workout.date}T${hours}:${minutes}:00`;
  }
  
  // Create description from workout sections and exercises
  const description = formatWorkoutDescription(workout);
  
  return {
    name: workout.title,
    type: workout.stravaActivityType,
    sport_type: workout.stravaActivityType,
    start_date_local: startDateTime,
    elapsed_time: workout.duration,
    description: description,
    distance: 0, // Default to 0 for weight training
    trainer: 1, // Indoor workout
    commute: 0  // Not a commute
  };
}

/**
 * Format workout data into a nicely formatted description for Strava
 */
function formatWorkoutDescription(workout: WorkoutData): string {
  let description = `🏋️ ${workout.focus} Workout\n\n`;
  
  // Add each section and its exercises
  workout.sections.forEach(section => {
    description += `## ${section.sectionName}\n`;
    
    section.exercises.forEach(exercise => {
      description += `- ${exercise.name}: ${exercise.sets}×${exercise.reps}`;
      
      if (exercise.weight) {
        description += ` @ ${exercise.weight}lbs`;
      }
      
      if (exercise.notes) {
        description += ` (${exercise.notes})`;
      }
      
      description += '\n';
    });
    
    description += '\n';
  });
  
  if (workout.notes) {
    description += `Notes: ${workout.notes}\n\n`;
  }
  
  // Add some stats and hashtags
  description += `Total workout time: ${formatTime(workout.duration)}\n`;
  
  // Add workout time information if available
  if (workout.workoutTime) {
    description += `Workout time: ${workout.workoutTime}\n`;
  }
  
  description += `#2025FitnessJourney #${workout.focus.replace(/\s+/g, '')}`;
  
  return description;
}

/**
 * Format seconds as a readable time string
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
}