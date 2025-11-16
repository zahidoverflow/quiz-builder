# LFI Demo - Quick Reference Card

## 🎯 PRESENTATION SETUP (Before Demo)

### Terminal 1 (Optional - Local Test)
```bash
cd quiz-builder-ocr-ai
npm run dev
# App at http://localhost:5173
```

### Terminal 2 (Scanner)
```bash
cd vulnascanner
python main.py
```

### Browser Tab
- Open: https://quiz-builder-ocr.vercel.app/

---

## 🚀 SCANNER COMMANDS (Copy-Paste Ready)

### Menu Selection
```
1
```

### Target URL
```
https://quiz-builder-ocr.vercel.app/api/read-file
```

### Payloads File
```
payloads/lfi-payloads.txt
```

### Success Criteria
```
"name":,"version":,"dependencies":
```

### Threads
```
5
```

### Generate Report
```
y
lfi-scan-results
```

---

## 📊 KEY STATISTICS TO MENTION

- ✅ **50+ LFI payloads** in testing suite
- 🎯 **Path traversal techniques**: ../, encoded variants, double encoding
- 🔍 **Target files**: package.json, vercel.json, .env, README.md
- ⚡ **Multi-threaded scanning** for speed
- 📈 **HTML reports** with visual timeline
- 🌐 **Live production testing** on Vercel

---

## 🎤 TALKING POINTS

### 1. Introduction (30 sec)
"Today I'm demonstrating a **Security Testing Laboratory** where we test web applications for Local File Inclusion vulnerabilities. This is a real production app running on Vercel."

### 2. The Vulnerability (45 sec)
"LFI allows attackers to read sensitive files on the server through path traversal attacks like `../../etc/passwd`. Our quiz-builder has an intentionally vulnerable endpoint at `/api/read-file` that accepts file paths without validation."

### 3. The Scanner (30 sec)
"Our VulnaScanner tool uses **420+ security payloads** across 5 vulnerability types. Today we're focusing on LFI with 50 specialized payloads."

### 4. Live Demo (3 min)
[Run the scanner and show real-time results]
"Watch as the scanner tests each payload. **RED** indicates a successful vulnerability exploit."

### 5. Results (45 sec)
"The HTML report shows:
- Number of vulnerabilities found
- Exact vulnerable URLs
- Scan time and statistics
- Visual timeline of the attack"

### 6. Remediation (30 sec)
"To fix this:
1. **Validate** all file paths
2. Use **allowlists** not blocklists  
3. Implement **access controls**
4. **Sanitize** user input
5. Never expose internal file system"

---

## 🐛 TROUBLESHOOTING

### No vulnerabilities found?
```bash
# Test manually first:
curl "https://quiz-builder-ocr.vercel.app/api/read-file?file=../package.json"
```

### Scanner not finding payloads file?
```bash
# Use full path:
e:\Repo\quiz-builder\vulnascanner\payloads\lfi-payloads.txt
```

### Python errors?
```bash
pip install requests prompt_toolkit colorama rich
```

---

## 🎬 DEMO FLOW (5-7 minutes)

1. **Show live app** (1 min) → https://quiz-builder-ocr.vercel.app/
2. **Explain vulnerability** (1 min) → Show code briefly
3. **Start scanner** (30 sec) → `python main.py`
4. **Enter configuration** (1 min) → Copy-paste from above
5. **Watch scan execute** (2-3 min) → Point out findings
6. **Generate report** (30 sec) → Open in browser
7. **Discuss remediation** (1 min) → Security best practices

---

## ✅ EXPECTED VULNERABLE URLS

```
✓ ?file=../package.json
✓ ?file=../../package.json  
✓ ?file=../../../package.json
✓ ?file=../vercel.json
✓ ?file=../../vercel.json
✓ ?file=../README.md
✓ ?file=package.json
✓ ?file=vercel.json
```

---

## 💡 BONUS POINTS

- **DevSecOps Integration**: This scanner can be integrated into CI/CD pipelines
- **Compliance**: Helps meet security testing requirements
- **Cost-effective**: Open source tool vs commercial scanners
- **Educational**: Perfect for security training and awareness
- **Real-world**: Tests actual production applications, not sandboxes

---

## 📝 CLOSING STATEMENT

"This demonstrates the importance of security testing in modern web applications. By integrating automated vulnerability scanning into our development workflow, we can identify and fix security issues before they reach production. Thank you!"

---

**Pro Tip**: Keep this file open on a second screen during your presentation for quick reference! 🎯
