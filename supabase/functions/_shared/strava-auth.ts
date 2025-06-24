// Interface for Strava API credentials
export interface StravaCredentials {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  }
  
  // Interface for token response
  interface TokenResponse {
    token_type: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    access_token: string;
    athlete?: any;
  }
  
  /**
   * Get a fresh Strava access token
   * Uses refresh token to obtain a valid access token
   */
  export async function getStravaAccessToken(
    credentials: StravaCredentials
  ): Promise<string> {
    try {
      console.log('Getting fresh Strava token...');
      
      // Request a new access token
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          refresh_token: credentials.refreshToken,
          grant_type: 'refresh_token'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(`Failed to refresh token: ${errorData.message || response.statusText}`);
      }
      
      const tokenData = await response.json() as TokenResponse;
      
      return tokenData.access_token;
    } catch (error: any) {
      console.error('Error getting Strava access token:', error);
      throw new Error(`Failed to get Strava access token: ${error.message}`);
    }
  }
  
  /**
   * Initialize Strava authentication and verify credentials
   */
  export async function initStravaAuth(credentials: StravaCredentials): Promise<void> {
    try {
      // Get a token to verify the credentials work
      const token = await getStravaAccessToken(credentials);
      console.log('Strava authentication successful');
      
      // Test the token by getting the athlete profile
      await verifyToken(token);
    } catch (error) {
      console.error('Strava authentication failed:', error);
      throw error;
    }
  }
  
  /**
   * Verify token is valid by fetching athlete profile
   */
  async function verifyToken(token: string): Promise<void> {
    const response = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Token verification failed: ${response.statusText}`);
    }
    
    const athlete = await response.json();
    console.log(`Token verified for athlete: ${athlete.firstname} ${athlete.lastname}`);
  }
  
  /**
   * Get Strava credentials from environment variables
   */
  export function getStravaCredentials(user: 'DEVIN' | 'MATT'): StravaCredentials {
    const clientId = Deno.env.get(`STRAVA_CLIENT_ID_${user}`);
    const clientSecret = Deno.env.get(`STRAVA_CLIENT_SECRET_${user}`);
    const refreshToken = Deno.env.get(`STRAVA_REFRESH_TOKEN_${user}`);
    
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing Strava credentials. Please set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN environment variables.');
    }
    
    return {
      clientId,
      clientSecret,
      refreshToken
    };
  }