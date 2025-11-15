# Secret Management Guide

## Overview
This project uses environment variables to manage sensitive API keys and configuration. This ensures that secrets are never committed to version control.

## Files

### `.env.example`
- **Purpose**: Template file showing required environment variables
- **Version Control**: ✅ Committed to git
- **Usage**: Copy this file to create your local environment file

### `.env.local`
- **Purpose**: Local environment variables for development
- **Version Control**: ❌ Never committed (in .gitignore)
- **Usage**: Contains your actual API keys

### `.gitignore`
- Ensures all `.env*` files (except `.env.example`) are ignored by git
- Prevents accidental commits of sensitive data

## Setup Instructions

1. **Copy the example file:**
   ```bash
   copy .env.example .env.local
   ```

2. **Add your API key:**
   - Open `.env.local`
   - Replace `your_gemini_api_key_here` with your actual Gemini API key
   - Get your API key from: https://ai.google.dev/gemini-api

3. **Verify gitignore:**
   - Ensure `.env.local` is listed in `.gitignore`
   - Never commit files containing actual API keys

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Google Gemini API Key | Yes |

## Deployment (Vercel)

When deploying to Vercel:

1. **Connect your repository** to Vercel
2. **Set Root Directory** to `quiz-builder-ocr-ai` (important for monorepo structure)
3. **Add environment variable** in Vercel dashboard:
   - Go to: Project Settings → Environment Variables
   - Name: `API_KEY`
   - Value: Your actual Gemini API key
   - Environment: Production, Preview, and Development
4. **Deploy** - Vercel will automatically detect the configuration

**Important**: The API key is only used in the serverless function (`api/extract.ts`), not in the frontend build.

## Security Best Practices

- ✅ Never commit `.env.local` or any file containing actual secrets
- ✅ Always use `.env.example` as a template
- ✅ Rotate API keys if accidentally exposed
- ✅ Use different API keys for development and production
- ❌ Never hardcode API keys in source code
- ❌ Never share `.env.local` file contents
- ❌ Never log or display API keys in the application

## Troubleshooting

**Error: "API_KEY environment variable is not set"**
- Ensure `.env.local` file exists
- Verify the variable name is exactly `API_KEY`
- Restart your development server after creating/modifying `.env.local`

**Changes not taking effect**
- Restart the Vite dev server (`npm run dev`)
- Check for typos in variable names
- Ensure no extra spaces around the `=` sign in `.env.local`
