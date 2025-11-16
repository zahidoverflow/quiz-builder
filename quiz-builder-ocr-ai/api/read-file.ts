import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from 'fs';
import * as path from 'path';

/**
 * INTENTIONALLY VULNERABLE ENDPOINT FOR SECURITY TESTING
 * This endpoint demonstrates Local File Inclusion (LFI) vulnerability
 * DO NOT USE IN PRODUCTION
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS for testing
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // VULNERABILITY: Direct use of user input without validation
    const filePath = req.query.file as string;

    if (!filePath) {
      return res.status(400).json({ 
        error: 'Missing file parameter',
        usage: 'Example: /api/read-file?file=../../../etc/passwd'
      });
    }

    // VULNERABILITY: No path sanitization or validation
    // This allows path traversal attacks like ../../etc/passwd
    const fullPath = path.join(process.cwd(), filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        error: 'File not found',
        attempted_path: fullPath
      });
    }

    // VULNERABILITY: Reading any file accessible to the process
    const fileContent = fs.readFileSync(fullPath, 'utf-8');

    // Return the file content (exposes sensitive data)
    return res.status(200).json({
      success: true,
      file: filePath,
      content: fileContent,
      warning: 'This endpoint is intentionally vulnerable for security testing'
    });

  } catch (error: any) {
    // VULNERABILITY: Exposing internal error details
    return res.status(500).json({ 
      error: 'Error reading file',
      details: error.message,
      stack: error.stack
    });
  }
}
