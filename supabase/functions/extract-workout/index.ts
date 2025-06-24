// supabase/functions/extract-workout/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { extractWorkoutFromSheets } from '../_shared/sheets-extractor.ts'
import { SheetCellParams } from '../_shared/types.ts'

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Parse the request body
    const params = await req.json() as SheetCellParams
    
    // Validate input
    if (!params.workoutDay || !params.startCell || !params.exerciseCount || !params.user) {
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
    
    // Extract workout data from Google Sheets
    const result = await extractWorkoutFromSheets(params)
    
    // Return the workout data
    return new Response(
      JSON.stringify(result),
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