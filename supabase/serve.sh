#!/usr/bin/env bash

# NOTE: run this from resiclub directory

# Start the Supabase Functions development server
supabase functions serve --import-map supabase/functions/import_map.json --env-file supabase/.env.local "$@" &

# Start the Stripe webhook function without JWT verification
supabase functions serve handle-stripe-events --no-verify-jwt --import-map supabase/functions/import_map.json --env-file supabase/.env.local &

# Wait for both background processes
wait