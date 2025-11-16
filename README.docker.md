# Docker Setup Guide

This project uses Docker and Docker Compose for containerized deployment of the Quiz Builder application and N8N workflow automation.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your actual API keys and configuration.

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications:**
   - Quiz Builder App: http://localhost:5173
   - N8N Workflow: http://localhost:5678

## Services

### Quiz Builder App (`quiz-app`)
- **Port:** 5173
- **Description:** React + TypeScript + Vite application for quiz generation
- **Environment Variables:**
  - `API_KEY`: Google Gemini API key (required)
  - `NODE_ENV`: development/production

### N8N Workflow Automation (`n8n`)
- **Port:** 5678
- **Description:** Workflow automation platform
- **Default Credentials:**
  - Username: admin (can be changed in .env)
  - Password: changeme (can be changed in .env)
- **Data Persistence:** `./n8n/data/`

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f quiz-app
docker-compose logs -f n8n
```

### Rebuild services
```bash
docker-compose up -d --build
```

### Restart a service
```bash
docker-compose restart quiz-app
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

## Production Deployment

For production, use the production Dockerfile:

```bash
docker build -f Dockerfile.production -t quiz-builder-prod .
docker run -d -p 5173:5173 --env-file .env quiz-builder-prod
```

## Environment Variables

All environment variables are defined in `.env` file at the project root. See `.env.example` for available options.

### Required Variables:
- `API_KEY`: Your Google Gemini API key

### Optional Variables:
- `N8N_BASIC_AUTH_USER`: N8N username (default: admin)
- `N8N_BASIC_AUTH_PASSWORD`: N8N password (default: changeme)
- `N8N_PORT`: N8N port (default: 5678)
- `NODE_ENV`: Environment mode (default: development)

## Troubleshooting

### Port already in use
If ports 5173 or 5678 are already in use, modify them in `.env`:
```env
VITE_PORT=3000
N8N_PORT=3678
```
Then update `docker-compose.yml` accordingly.

### Permission issues
If you encounter permission issues with volumes:
```bash
sudo chown -R $USER:$USER ./n8n/data
```

### Container fails to start
Check logs for specific service:
```bash
docker-compose logs quiz-app
```

## Network

All services communicate through the `quiz-network` bridge network, allowing them to interact with each other using service names as hostnames.
