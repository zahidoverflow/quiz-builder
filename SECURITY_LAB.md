# Quiz Builder Security Testing Lab

## 🎯 Project Overview

This repository demonstrates a **comprehensive security testing framework** combining:
- **Quiz Builder OCR AI** - The target web application (testing subject)
- **VulnaScanner** - Advanced vulnerability scanner (security testing tool)

This setup showcases a complete security testing laboratory where VulnaScanner performs automated security assessments on the Quiz Builder application, identifying vulnerabilities across multiple attack vectors.

---

## 🏗️ Project Architecture

```
quiz-builder/
├── quiz-builder-ocr-ai/          # TARGET APPLICATION (Test Subject)
│   ├── Web Application           # React + Vite frontend
│   ├── Serverless API            # Vercel functions (api/)
│   ├── AI Integration            # Google Gemini API
│   └── Security Features         # Environment var management
│
├── vulnascanner/                 # SECURITY TESTING TOOL
│   ├── Scanner Engine            # Multi-threaded vulnerability scanner
│   ├── Attack Vectors            # LFI, SQLi, XSS, CRLF, OR
│   ├── Payload Library           # Customizable attack payloads
│   └── Reporting Engine          # HTML vulnerability reports
│
└── SECURITY_LAB.md              # This documentation
```

---

## 🔬 Security Testing Capabilities

### VulnaScanner Features

| Attack Vector | Description | Payload Count |
|---------------|-------------|---------------|
| **LFI** (Local File Inclusion) | Tests for unauthorized file access | 50+ payloads |
| **SQLi** (SQL Injection) | Database injection testing | 200+ payloads |
| **XSS** (Cross-Site Scripting) | JavaScript injection testing | 100+ payloads |
| **CRLF** (Header Injection) | HTTP header manipulation | 30+ payloads |
| **OR** (Open Redirect) | URL redirection vulnerabilities | 40+ payloads |

### Scanner Architecture
- **Multi-threaded Scanning**: Concurrent vulnerability testing
- **Selenium Integration**: Headless browser for XSS testing
- **Custom Payloads**: Extensible payload library
- **HTML Reports**: Professional vulnerability documentation
- **Success Detection**: Intelligent vulnerability confirmation

---

## 🎯 Target Application: Quiz Builder OCR AI

### Application Components

#### 1. Frontend (React + TypeScript)
```typescript
Components:
├── ImageUploader    - File upload functionality
├── QuestionList     - Dynamic content rendering
├── QuestionItem     - User input handling
└── API Service      - Backend communication
```

#### 2. Backend (Serverless Functions)
```typescript
API Endpoints:
└── /api/extract
    ├── POST request handler
    ├── File processing (images/PDFs)
    ├── Google Gemini AI integration
    └── JSON response
```

#### 3. Security Features
- Environment variable management
- API key protection
- Input validation
- CORS configuration
- Content Security Policy

---

## 🔍 Testing Methodology

### Phase 1: Reconnaissance
```bash
# Identify application endpoints
Target URL: https://quiz-builder.vercel.app
API Endpoints: /api/extract

# Map attack surface
- File upload functionality
- Form inputs (questions, options)
- API parameters (base64ImageData, mimeType)
- Query parameters
```

### Phase 2: Vulnerability Scanning

#### A. XSS Testing
```bash
cd vulnascanner
python3 main.py

# Test vectors:
- Image file names with XSS payloads
- Question text inputs
- Option fields
- API response handling
```

#### B. SQL Injection Testing
```bash
# Target: API parameters
- base64ImageData parameter
- mimeType parameter
- Any database queries in backend
```

#### C. LFI Testing
```bash
# Test file upload functionality
- Path traversal in file names
- MIME type manipulation
- Base64 encoding exploits
```

#### D. CRLF Injection
```bash
# Test HTTP headers
- File upload headers
- API request headers
- Response header manipulation
```

#### E. Open Redirect
```bash
# Test URL parameters
- Callback URLs
- Redirect parameters
- OAuth flows (if implemented)
```

---

## 🚀 Running Security Tests

### Prerequisites

**For VulnaScanner:**
```bash
cd vulnascanner

# Install Python dependencies
pip3 install -r requirements.txt

# Install Chrome (Linux)
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

# Install ChromeDriver
wget https://storage.googleapis.com/chrome-for-testing-public/128.0.6613.119/linux64/chromedriver-linux64.zip
unzip chromedriver-linux64.zip
```

**For Quiz Builder:**
```bash
cd quiz-builder-ocr-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Gemini API key to .env.local

# Run locally
npm run dev

# Or use deployed version
# Production URL: https://quiz-builder.vercel.app
```

---

## 📊 Test Execution Workflow

### Step 1: Prepare Target URLs
```bash
# Create urls.txt in vulnascanner directory
echo "https://quiz-builder.vercel.app" > urls.txt
echo "https://quiz-builder.vercel.app/api/extract" >> urls.txt

# For local testing
echo "http://localhost:5173" > urls_local.txt
```

### Step 2: Run Comprehensive Scan
```bash
cd vulnascanner
python3 main.py

# Scanner will prompt for:
# 1. Input URL or file path
# 2. Vulnerability type (LFI/OR/SQLi/XSS/CRLF)
# 3. Number of threads
# 4. Custom payloads (optional)
```

### Step 3: Review Results
```bash
# Vulnerable URLs are saved to:
vulnascanner/vulnerable_urls_[timestamp].txt

# HTML report generated:
vulnascanner/vulnerability_report_[timestamp].html
```

---

## 📈 Expected Security Findings

### ✅ Protected Areas (Expected)
- ✅ API key not exposed in client code
- ✅ Environment variables properly managed
- ✅ Serverless function isolation
- ✅ Input validation on file types

### ⚠️ Potential Vulnerabilities (Testing Focus)

#### 1. **File Upload Security**
```javascript
Risk: File type validation bypass
Test: Upload malicious file types with spoofed MIME types
Impact: Code execution, XSS via file content
```

#### 2. **XSS in Dynamic Content**
```javascript
Risk: Unsanitized text in questions/options
Test: Inject XSS payloads in extracted text
Impact: Session hijacking, credential theft
```

#### 3. **API Parameter Tampering**
```javascript
Risk: Insufficient input validation
Test: Manipulate base64ImageData, mimeType parameters
Impact: Service disruption, data manipulation
```

#### 4. **CORS Misconfiguration**
```javascript
Risk: Overly permissive CORS policy
Test: Cross-origin requests from malicious domains
Impact: Data theft, CSRF attacks
```

---

## 🛡️ Security Hardening Recommendations

### 1. Input Validation
```typescript
// Implement strict validation
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateUpload(file: File): boolean {
  return ALLOWED_MIME_TYPES.includes(file.type) && 
         file.size <= MAX_FILE_SIZE;
}
```

### 2. Content Security Policy
```typescript
// Add CSP headers in vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.tailwindcss.com"
        }
      ]
    }
  ]
}
```

### 3. Rate Limiting
```typescript
// Implement API rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 4. Output Encoding
```typescript
// Sanitize extracted text
import DOMPurify from 'dompurify';

function sanitizeOutput(text: string): string {
  return DOMPurify.sanitize(text);
}
```

---

## 📋 Testing Checklist

### Pre-Test Preparation
- [ ] Deploy Quiz Builder to Vercel
- [ ] Set up VulnaScanner with dependencies
- [ ] Prepare target URL list
- [ ] Configure custom payloads (if needed)
- [ ] Set up logging and monitoring

### Vulnerability Scanning
- [ ] LFI scan on file upload
- [ ] SQL injection on API endpoints
- [ ] XSS testing on all input fields
- [ ] CRLF injection on headers
- [ ] Open redirect testing
- [ ] Authenticated vs unauthenticated tests

### Post-Test Analysis
- [ ] Review vulnerability reports
- [ ] Categorize findings by severity
- [ ] Document proof-of-concept exploits
- [ ] Create remediation plan
- [ ] Retest after fixes

---

## 📊 Sample Test Results Format

```
┌─────────────────────────────────────────────────────────┐
│         Security Assessment Summary                      │
├─────────────────────────────────────────────────────────┤
│ Target: Quiz Builder OCR AI                             │
│ URL: https://quiz-builder.vercel.app                    │
│ Scan Date: 2025-11-16                                   │
│ Duration: 15 minutes                                     │
├─────────────────────────────────────────────────────────┤
│ Vulnerabilities Found:                                   │
│   Critical:    0                                         │
│   High:        2                                         │
│   Medium:      3                                         │
│   Low:         5                                         │
│   Info:        8                                         │
├─────────────────────────────────────────────────────────┤
│ Status: PASSED with recommendations                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Presentation Guide

### Slide Structure

#### 1. Introduction (2 min)
- Project overview
- Security testing importance
- Lab architecture

#### 2. Target Application (3 min)
- Quiz Builder features
- Technology stack
- Attack surface analysis

#### 3. VulnaScanner Tool (3 min)
- Scanner capabilities
- Supported attack vectors
- Payload library

#### 4. Live Demo (5 min)
- Run vulnerability scan
- Show real-time results
- Generate HTML report

#### 5. Findings & Recommendations (2 min)
- Vulnerability summary
- Security hardening tips
- Best practices

### Demo Script

```bash
# Terminal 1: Start Quiz Builder
cd quiz-builder-ocr-ai
npm run dev
# Show application running at localhost:5173

# Terminal 2: Run VulnaScanner
cd vulnascanner
python3 main.py
# Select XSS scanning
# Input: http://localhost:5173
# Show real-time scanning
# Display found vulnerabilities

# Browser: Show HTML report
open vulnerability_report_*.html
# Demonstrate professional reporting
```

---

## 🔗 Integration Benefits

### Educational Value
- **Real-world Testing**: Practical security assessment workflow
- **Tool Integration**: Combining offensive and defensive security
- **Reporting**: Professional vulnerability documentation
- **Methodology**: Industry-standard testing approach

### Professional Application
- **CI/CD Integration**: Automated security testing
- **Compliance**: Meeting security requirements
- **Risk Assessment**: Quantifiable security metrics
- **Remediation**: Actionable security improvements

---

## 📚 Additional Resources

### Documentation
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Web Security Academy](https://portswigger.net/web-security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Tools
- **Burp Suite**: Web application security testing
- **OWASP ZAP**: Open-source security scanner
- **SQLMap**: Automated SQL injection tool
- **Nikto**: Web server scanner

---

## 🤝 Contributors

- **Quiz Builder OCR AI**: zahidoverflow
- **VulnaScanner Integration**: Security Testing Framework

---

## 📄 License

This security testing framework is for educational and authorized testing purposes only.

**⚠️ Warning**: Only test applications you own or have explicit permission to test. Unauthorized testing is illegal.

---

## 🎯 Conclusion

This security testing lab demonstrates:
- ✅ Complete SDLC security integration
- ✅ Automated vulnerability assessment
- ✅ Professional security reporting
- ✅ Real-world security testing methodology
- ✅ Practical remediation strategies

**Perfect for presentations showcasing**:
- Security engineering practices
- DevSecOps implementation
- Vulnerability management
- Application security testing
