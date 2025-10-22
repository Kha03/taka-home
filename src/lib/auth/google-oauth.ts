/**
 * Google OAuth Utility Functions
 */

import { saveOAuthState } from './oauth-storage';

export const createGoogleAuthUrl = (action: 'signin' | 'signup' = 'signin'): string => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error('Google OAuth configuration missing. Please check your environment variables.');
    throw new Error('Google OAuth configuration missing');
  }

  // Save state to localStorage before redirect
  saveOAuthState(action);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
    state: `${action}_${Date.now()}` // Include action and timestamp in state
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const handleGoogleAuth = (action: 'signin' | 'signup' = 'signin'): void => {
  try {
    // Save current page URL for redirect after login
    if (typeof window !== 'undefined') {
      localStorage.setItem('oauth_redirect_url', window.location.pathname);
    }
    
    const authUrl = createGoogleAuthUrl(action);
    // Redirect to Google OAuth
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to initiate Google authentication:', error);
    // You might want to show a toast or error message to the user
    alert('Không thể kết nối với Google. Vui lòng thử lại sau.');
  }
};

export const isGoogleOAuthConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
  );
};