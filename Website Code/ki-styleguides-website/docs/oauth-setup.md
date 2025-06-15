# OAuth Setup Guide

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:4321/auth/callback/google`
     - For production: `https://your-domain.com/auth/callback/google`
5. Copy the Client ID and Client Secret
6. Add them to your `.env` file:
   ```
   AUTH_GOOGLE_ID=your-client-id
   AUTH_GOOGLE_SECRET=your-client-secret
   ```

### Required Scopes
The application only requests minimal scopes:
- `openid` - Basic OpenID Connect
- `email` - User's email address
- `profile` - User's basic profile info (name)

## GitHub OAuth Setup

(To be added in the next step)