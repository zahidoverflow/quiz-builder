# LFI Scanner Setup & Demo Guide

## Quick Start for Presentation

### 1. Test the Vulnerable Endpoint Locally (Optional)

First, ensure the quiz-builder app is running:
```bash
cd quiz-builder-ocr-ai
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

Test the vulnerable endpoint manually:
```bash
curl "http://localhost:5173/api/read-file?file=../package.json"
```

### 2. Run the LFI Scanner

Open a **new terminal** and navigate to the scanner directory:
```bash
cd vulnascanner
python main.py
```

### 3. Scanner Menu
When the scanner starts, you'll see:
```
┌────────────────────────────────────────────────────────────────────────┐
│ 1] LFI Scanner - Test Local File Inclusion Vulnerabilities            │
│ 2] Exit                                                                │
└────────────────────────────────────────────────────────────────────────┘
```

Select **1** for LFI Scanner.

### 4. Configure the Scan

The scanner will prompt you for:

**Step 1: Target URL**
```
[?] Enter the path to the file containing URLs (or press Enter to input a single URL): 
```
Press Enter, then input:
```
https://quiz-builder-ocr.vercel.app/api/read-file
```

**Step 2: Payloads File**
```
[?] Enter the path to the payloads file:
```
Input:
```
payloads/lfi-payloads.txt
```

**Step 3: Success Criteria** (press Enter for default)
```
[?] Enter the success criteria patterns (comma-separated, e.g: 'root:,admin:', press Enter for 'root:x:0:'):
```
For quiz-builder app, enter:
```
"name":,"version":,"dependencies":
```
This will detect successful reads of package.json files.

**Step 4: Thread Count** (press Enter for 5)
```
[?] Enter the number of concurrent threads (0-10, press Enter for 5):
```

### 5. Watch the Scan

The scanner will:
- Test each payload against the URL
- Display vulnerabilities in **RED** when found
- Show progress for each test
- Generate statistics at the end

### 6. Generate HTML Report

When scan completes:
```
[?] Do you want to generate an HTML report? (y/n): y
[?] Enter the filename for the HTML report: lfi-scan-results
```

The report will be saved as `lfi-scan-results.html` and can be opened in a browser.

---

## Demo Script for Live Presentation

### Terminal Setup (Before Presentation)
1. **Terminal 1**: Ready at `quiz-builder-ocr-ai/` directory
2. **Terminal 2**: Ready at `vulnascanner/` directory  
3. **Browser**: Have https://quiz-builder-ocr.vercel.app/ open

### Live Demo Steps (5-7 minutes)

**1. Show the Live Application** (1 min)
- Navigate to https://quiz-builder-ocr.vercel.app/
- "This is our quiz builder application running on Vercel"
- "It has various features for creating quizzes, but today we're testing its security"

**2. Explain the Vulnerability** (1 min)
- "We have an API endpoint at `/api/read-file` that reads files"
- "This endpoint is intentionally vulnerable for this demonstration"
- Show the vulnerable code in `api/read-file.ts` briefly

**3. Start the Scanner** (30 seconds)
```bash
cd vulnascanner
python main.py
```
- Select **1** for LFI Scanner

**4. Configure the Test** (1 min)
- URL: `https://quiz-builder-ocr.vercel.app/api/read-file`
- Payloads: `payloads/lfi-payloads.txt`
- Success criteria: `"name":,"version":,"dependencies":`
- Threads: `5`

**5. Watch the Scan Execute** (2-3 min)
- Point out vulnerabilities as they appear in RED
- Explain what path traversal is (../../)
- Show how the scanner tests different encoding techniques

**6. Review Results** (1 min)
- Generate HTML report
- Open report in browser
- Highlight:
  - Number of vulnerabilities found
  - Vulnerable URLs
  - Time taken
  - Scan statistics

**7. Remediation Discussion** (1 min)
- "How to fix this vulnerability:"
  1. Validate and sanitize file paths
  2. Use allowlists instead of blocklists
  3. Implement proper access controls
  4. Never expose internal file system to users
  5. Use security libraries for path validation

---

## Testing Against Production URL

The scanner is pre-configured to test against:
```
https://quiz-builder-ocr.vercel.app/api/read-file
```

This is your live Vercel deployment. When you push changes to GitHub, Vercel will automatically redeploy.

### Expected Vulnerable URLs

The scanner should detect vulnerabilities like:
- `https://quiz-builder-ocr.vercel.app/api/read-file?file=../package.json`
- `https://quiz-builder-ocr.vercel.app/api/read-file?file=../../package.json`
- `https://quiz-builder-ocr.vercel.app/api/read-file?file=../../../package.json`
- `https://quiz-builder-ocr.vercel.app/api/read-file?file=../vercel.json`
- `https://quiz-builder-ocr.vercel.app/api/read-file?file=../README.md`

---

## Troubleshooting

### Scanner doesn't find vulnerabilities
- Check if Vercel deployment is complete
- Test the endpoint manually first:
  ```bash
  curl "https://quiz-builder-ocr.vercel.app/api/read-file?file=../package.json"
  ```
- Adjust success criteria to match actual response content

### Python dependencies missing
```bash
pip install requests prompt_toolkit colorama rich
```

### Can't find payloads file
- Ensure you're in the `vulnascanner/` directory
- Use absolute path: `e:\Repo\quiz-builder\vulnascanner\payloads\lfi-payloads.txt`

---

## Key Talking Points for Presentation

1. **Problem**: Many web applications accept file paths as input without validation
2. **Impact**: Attackers can read sensitive files (config, passwords, source code)
3. **Demo**: Live scanning of production application on Vercel
4. **Detection**: Automated scanner with 50+ payloads and pattern matching
5. **Solution**: Input validation, path sanitization, access controls

---

## After Presentation

Remember to either:
1. Remove the vulnerable endpoint (`api/read-file.ts`)
2. Add proper security validation
3. Keep it for future security testing (not recommended for production)

---

## Statistics to Mention

- **50+ LFI payloads** tested
- **Multiple encoding techniques** (URL encoding, double encoding, Unicode)
- **Path traversal patterns** (../, ..\.., encoded variants)
- **Common sensitive files** (package.json, .env, vercel.json, etc.)
- **Automated detection** using pattern matching
- **HTML report generation** with timeline and vulnerability details

Good luck with your presentation! 🎯🔒
