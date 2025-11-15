# Security Checklist

## ✅ Before Committing Code

- [ ] No API keys or secrets in source code
- [ ] `.env.local` is listed in `.gitignore`
- [ ] Only `.env.example` contains placeholder values
- [ ] No hardcoded credentials in any file
- [ ] Review `git diff` before committing
- [ ] Check for accidental console.log of sensitive data

## ✅ Environment Setup

- [ ] `.env.example` created with placeholder values
- [ ] `.env.local` created from `.env.example`
- [ ] Actual API key added to `.env.local`
- [ ] `.gitignore` includes all environment files
- [ ] Environment variables properly loaded in Vite config

## ✅ Deployment (Vercel)

- [ ] Environment variables added in Vercel dashboard
- [ ] Production API key is different from development
- [ ] API key has appropriate rate limits configured
- [ ] Environment variables set for all environments (Production, Preview, Development)

## ✅ Code Review

- [ ] No `console.log()` statements exposing secrets
- [ ] Error messages don't reveal sensitive information
- [ ] API responses don't include API keys
- [ ] Client-side code doesn't expose backend secrets
- [ ] Proper error handling for missing environment variables

## ✅ Git History

- [ ] No commits containing actual API keys
- [ ] If secrets were committed, rotate them immediately
- [ ] Consider using git-secrets or similar tools
- [ ] Review commit history before pushing to public repo

## 🚨 If Secret is Exposed

1. **Immediately revoke/rotate the exposed key**
2. Generate a new API key
3. Update `.env.local` with new key
4. Update Vercel environment variables
5. Consider using git history rewriting (if necessary)
6. Review access logs for suspicious activity

## 🔒 Best Practices

- Use different API keys for development and production
- Set up API key restrictions (IP allowlist, referrer restrictions)
- Enable rate limiting on your API keys
- Monitor API usage regularly
- Rotate API keys periodically
- Use environment-specific configurations
- Never share `.env.local` via email, chat, or screenshots

## 📋 Regular Audits

- [ ] Monthly review of API key usage
- [ ] Quarterly rotation of API keys
- [ ] Regular `.gitignore` validation
- [ ] Security dependency updates
- [ ] Review Vercel deployment logs

## 🛠️ Tools

- **git-secrets**: Prevent committing secrets
- **truffleHog**: Scan for secrets in git history
- **dotenv-vault**: Encrypted environment management
- **1Password/LastPass**: Secure secret storage for team sharing

## 📚 Resources

- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
