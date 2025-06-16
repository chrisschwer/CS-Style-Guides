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

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the application details:
   - **Application name**: KI Styleguides
   - **Homepage URL**: `https://your-domain.com` (or `http://localhost:4321` for development)
   - **Authorization callback URL**: 
     - For development: `http://localhost:4321/auth/callback/github`
     - For production: `https://your-domain.com/auth/callback/github`
5. Click "Register application"
6. On the next page, you'll see your Client ID
7. Click "Generate a new client secret" to get your Client Secret
8. Add them to your `.env` file:
   ```
   AUTH_GITHUB_ID=your-client-id
   AUTH_GITHUB_SECRET=your-client-secret
   ```

### Required Scopes
The application only requests minimal scopes:
- `read:user` - Read access to user profile information
- `user:email` - Access to user email addresses

### Notes
- GitHub OAuth Apps are tied to a single user account or organization
- For production deployment, consider creating the OAuth App under an organization account
- The callback URL must match exactly (including the protocol and trailing slashes)