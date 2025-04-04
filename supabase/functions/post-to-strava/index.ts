// supabase/functions/post-to-strava/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getStravaCredentials } from '../_shared/strava-auth.ts'
import { postWorkoutToStrava } from '../_shared/strava-integration.ts'
import { WorkoutData } from '../_shared/types.ts'

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Parse the request body
    const workout = await req.json() as WorkoutData
    
    // Validate workout data
    if (!workout || !workout.date || !workout.title || !workout.sections) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid workout data provided' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Get Strava credentials from environment variables
    const credentials = getStravaCredentials()
    
    // Post workout to Strava
    const result = await postWorkoutToStrava(workout, credentials)
    
    // Return the Strava post result
    return new Response(
      JSON.stringify({
        success: result.success,
        stravaId: result.stravaId,
        stravaUrl: result.url,
        error: result.error,
        data: workout
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      }
    )
    
  } catch (error) {
    // Log the error for debugging
    console.error('Error:', error.message)
    
    // Return error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})