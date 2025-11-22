# Deployment Checklist for Vercel

## ✅ Pre-Deployment Checklist

### Configuration Files
- [x] `vercel.json` configured with correct build settings
- [x] `package.json` has all required dependencies
- [x] `tsconfig.json` properly configured
- [x] `.gitignore` excludes sensitive files
- [x] `.env.example` provided as template

### API & Environment
- [x] Serverless API function in `api/extract.ts`
- [x] API uses `process.env.API_KEY` (Vercel environment variable)
- [x] Frontend calls `/api/extract` endpoint
- [x] No API keys hardcoded in source code

### Build Configuration
- [x] Build command: `npm run build`
- [x] Output directory: `dist`
- [x] TypeScript compilation configured
- [x] React plugin configured

## 🚀 Deployment Steps

### 1. Prepare Repository
```bash
cd quiz-builder-ocr-ai
npm install
npm run build  # Test local build
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 3. Configure Vercel Project

#### Via Vercel Dashboard:
1. Go to https://vercel.com/new
2. Import your `quiz-builder` repository
3. **Critical**: Set **Root Directory** to `quiz-builder-ocr-ai`
4. Framework Preset: **Vite**
5. Build Command: `npm run build` (should auto-detect)
6. Output Directory: `dist` (should auto-detect)
7. Install Command: `npm install` (should auto-detect)

#### Environment Variables:
1. Go to Project Settings → Environment Variables
2. Add variable:
   - **Name**: `API_KEY`
   - **Value**: Your Google Gemini API key
   - **Environments**: Production, Preview, Development
3. Click "Save"

### 4. Deploy
Click "Deploy" button and wait for deployment to complete.

## 🔍 Post-Deployment Verification

### Test Your Deployment
1. Visit your Vercel deployment URL
2. Upload a test image
3. Click "Extract Quizzes"
4. Verify questions are extracted correctly
5. Test "Copy" functionality
6. Test "Start Over" functionality

### Check Vercel Logs
1. Go to Deployment → Functions → Logs
2. Monitor for any API errors
3. Verify API_KEY is being read correctly

## 🐛 Common Deployment Issues

### Issue: "API_KEY environment variable is not set"
**Solution**: 
- Verify environment variable is set in Vercel dashboard
- Redeploy after adding environment variables

### Issue: 404 on `/api/extract`
**Solution**:
- Ensure `api/extract.ts` file exists
- Check Vercel Functions tab to see if function deployed
- Verify Root Directory is set to `quiz-builder-ocr-ai`

### Issue: Build fails with TypeScript errors
**Solution**:
```bash
npm install @types/node --save-dev
npm run build
```

### Issue: "Module not found" errors
**Solution**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Commit and redeploy

### Issue: Root directory not set correctly
**Solution**:
- Go to Project Settings → General
- Set **Root Directory** to `quiz-builder-ocr-ai`
- Redeploy

## 📊 Performance Considerations

- **Cold Start**: First API call may be slower (~1-2 seconds)
- **Gemini API Quota**: Monitor your API usage at https://ai.google.dev/
- **Rate Limiting**: Consider implementing rate limiting for production
- **File Size**: Large images may take longer to process

## 🔒 Security Reminders

- ✅ API key is in Vercel environment variables, not code
- ✅ `.env.local` is gitignored
- ✅ API endpoint validates request method and parameters
- ✅ Error messages don't expose API key
- ⚠️ Consider adding authentication for production use
- ⚠️ Consider adding rate limiting per IP/user

## 🔄 Updating Deployment

For future updates:
```bash
git add .
git commit -m "Update: [description]"
git push origin main
```

Vercel will automatically redeploy on push to main branch.

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **Gemini API**: https://ai.google.dev/gemini-api/docs
- **Project Issues**: https://github.com/zahidoverflow/quiz-builder/issues

## ✅ Deployment Ready!

Your project is now configured and ready for Vercel deployment with:
- ✅ Proper monorepo structure support
- ✅ Serverless API functions
- ✅ Environment variable management
- ✅ Build optimization
- ✅ Security best practices
