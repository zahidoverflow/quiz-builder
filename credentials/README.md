# Credentials Configuration

This directory contains credential configuration templates for N8N.

## Important Security Notes

⚠️ **NEVER commit actual credentials or API keys to version control**

## Setup

1. Create your credential files based on the templates
2. Configure them in N8N UI
3. Reference them in your workflows

## Credential Types

Document the types of credentials needed for your workflows:

### Google API Credentials
- Gemini API key for quiz extraction
- Google Drive API (if needed)
- Google Sheets API (if needed)

### Webhook Credentials  
- Incoming webhook URLs
- Authentication tokens

### Database Connections
- Connection strings
- User credentials
- SSL certificates

### External APIs
- API keys
- OAuth tokens
- Service account credentials

## Templates

Create `.template` files for credential configurations:
- `gemini-api.template.json`
- `webhook-auth.template.json`  
- `database.template.json`
