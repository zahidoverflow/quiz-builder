# N8N Automation for Quiz Builder

This repository contains N8N workflow automation for the Quiz Bank Generator project.

## Quick Start

1. **Setup Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Start N8N with Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Access N8N:**
   - URL: http://localhost:5678
   - Username: admin
   - Password: changeme (or your custom password from .env)

## Project Structure

```
├── workflows/          # N8N workflow JSON exports
├── credentials/        # Credential configuration templates  
├── nodes/             # Custom node definitions
├── data/              # N8N data persistence
├── docker-compose.yml # Container orchestration
└── .env              # Environment variables
```

## Workflows

Import workflows from the `workflows/` directory into your N8N instance:

1. Open N8N web interface
2. Click "Import from File"
3. Select workflow JSON files from `workflows/`

## Environment Variables

Required variables (copy from `.env.example`):

- `N8N_BASIC_AUTH_USER`: N8N username
- `N8N_BASIC_AUTH_PASSWORD`: N8N password  
- `API_KEY`: Google Gemini API key
- `WEBHOOK_URL`: Webhook base URL

## Security

⚠️ **Never commit actual credentials to version control**

- Use `.env` for local development
- Use proper secret management for production
- Credential files are gitignored by default

## Integration with Quiz Builder

This N8N setup can automate:

- Image processing workflows
- Quiz extraction pipelines
- Data validation and formatting
- API integrations with external services
- Scheduled tasks and monitoring

## Support

For issues related to:
- N8N setup: Check the official [N8N documentation](https://docs.n8n.io/)
- Quiz Builder integration: See main project repository
