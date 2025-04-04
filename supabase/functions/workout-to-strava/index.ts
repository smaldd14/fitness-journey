// supabase/functions/workout-to-strava/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { extractWorkoutFromSheets } from '../_shared/sheets-extractor.ts'
import { getStravaCredentials } from '../_shared/strava-auth.ts'
import { postWorkoutToStrava } from '../_shared/strava-integration.ts'
import { SheetCellParams, WorkoutPostResponse } from '../_shared/types.ts'

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Parse the request body
    const params = await req.json() as SheetCellParams
    
    // Validate input
    if (!params.workoutDay || !params.startCell || !params.exerciseCount) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters (workoutDay, startCell, exerciseCount)' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Step 1: Extract workout data from Google Sheets
    console.log('Step 1: Extracting workout data from Google Sheets...')
    const extractResult = await extractWorkoutFromSheets(params)
    
    // If extraction failed, return the error
    if (!extractResult.success || !extractResult.data) {
      console.error('Workout extraction failed:', extractResult.error)
      return new Response(
        JSON.stringify({
          success: false,
          error: extractResult.error || 'Failed to extract workout data',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    // Step 2: Post the workout data to Strava
    console.log('Step 2: Posting workout data to Strava...')
    const workout = extractResult.data
    
    // Get Strava credentials from environment variables
    const credentials = getStravaCredentials()
    
    // Post workout to Strava
    const stravaResult = await postWorkoutToStrava(workout, credentials)
    
    // Prepare the response
    const response: WorkoutPostResponse = {
      success: stravaResult.success,
      data: workout,
      stravaPostId: stravaResult.stravaId,
      stravaUrl: stravaResult.url,
      error: stravaResult.error
    }
    
    // Return the complete result
    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: stravaResult.success ? 200 : 500
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