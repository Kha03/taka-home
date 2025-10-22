/**
 * OAuth Storage Utilities
 * Helper functions for managing OAuth state in localStorage
 */

const OAUTH_STATE_KEY = 'oauth_state';
const OAUTH_REDIRECT_KEY = 'oauth_redirect_url';

export const saveOAuthState = (action: 'signin' | 'signup', redirectUrl?: string) => {
  if (typeof window !== 'undefined') {
    const state = {
      action,
      timestamp: Date.now(),
      redirectUrl: redirectUrl || window.location.pathname,
    };
    localStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(state));
  }
};

export const getOAuthState = () => {
  if (typeof window !== 'undefined') {
    const stateStr = localStorage.getItem(OAUTH_STATE_KEY);
    if (stateStr) {
      try {
        return JSON.parse(stateStr);
      } catch (error) {
        console.error('Failed to parse OAuth state:', error);
        localStorage.removeItem(OAUTH_STATE_KEY);
      }
    }
  }
  return null;
};

export const clearOAuthState = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(OAUTH_STATE_KEY);
    localStorage.removeItem(OAUTH_REDIRECT_KEY);
  }
};

export interface OAuthState {
  action: 'signin' | 'signup';
  timestamp: number;
  redirectUrl: string;
}