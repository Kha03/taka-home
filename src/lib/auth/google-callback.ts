/**
 * Google OAuth Callback Handler
 * This would typically be implemented as an API route
 * Example: /app/api/auth/google/callback/route.ts
 */

export interface GoogleOAuthCallbackParams {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export const handleGoogleCallback = async (params: GoogleOAuthCallbackParams) => {
  // Check for errors
  if (params.error) {
    console.error('Google OAuth Error:', params.error, params.error_description);
    throw new Error(params.error_description || 'Google authentication failed');
  }

  // Check for authorization code
  if (!params.code) {
    throw new Error('Authorization code not received');
  }

  // Exchange authorization code for access token
  // This should be done on the backend for security
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET, // This should be on backend only
      code: params.code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange authorization code for tokens');
  }

  const tokens = await tokenResponse.json();

  // Get user information from Google
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to get user information from Google');
  }

  const userInfo = await userResponse.json();

  return {
    tokens,
    userInfo,
  };
};

// Types for Google user info
export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}