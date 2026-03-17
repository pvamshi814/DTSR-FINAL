# 🚀 Deployment Guide for Vercel

To deploy your AI Mock Interview application to Vercel and get the exact same results as your local version, follow these steps:

### 1. Prerequisites
- A Vercel account.
- GitHub repository connected to Vercel.

### 2. Configuration Settings
When you import the repository into Vercel, set the following:

- **Framework Preset**: `Create React App` (Vercel should auto-detect this for the frontend).
- **Environment Variables**: This is the most important part to get the "same output." You must add these keys in the Vercel Dashboard:
  - `SUPABASE_URL`: Your Supabase URL.
  - `SUPABASE_KEY`: Your Supabase Service Role Key.
  - `GEMINI_API_KEY`: Your Google Gemini API Key.
  - `JWT_SECRET`: A secure string for authentication.
  - `EMERGENT_LLM_KEY`: Your OpenAI API key (if still used).

### 3. Build & Routing
The included `vercel.json` handles the routing between your FastAPI backend and React frontend.
- API requests arriving at `/api/*` will be routed to the Python server.
- All other requests will be served by the React build.

### 4. Database Setup
Ensure you have run `python backend/create_tables.py` on your Supabase instance before deploying, as the app requires the `users` and `interviews` tables to exist.

---
**Note on Security**: GitHub and Vercel block the deployment of raw API keys for your safety. Always use the "Environment Variables" section in the Vercel dashboard instead of committing them to code.
