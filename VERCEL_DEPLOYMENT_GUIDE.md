# Vercel Deployment Guide for Dev+ Quote Builder

## Pre-Deployment Checklist

### ✅ Completed Fixes
1. **MongoDB Connection During Build** - Fixed: The application no longer tries to connect to MongoDB during static generation
2. **Environment Variables** - Created `.env.example` file with all required variables
3. **Build Process** - Verified successful build with `npm run build`

### ⚠️ Important Notes for Vercel

#### 1. Environment Variables Setup
You MUST add these environment variables in Vercel project settings:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `MONGODB_DB_NAME` - Database name (default: cluster0)
- `NEXT_PUBLIC_DEV_WHATSAPP_NUMBER` - WhatsApp number for integration

**Optional (if using Supabase):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Optional (if using Firebase):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

#### 2. MongoDB Atlas Configuration
Make sure your MongoDB Atlas cluster is configured correctly:
- Whitelist IP addresses: `0.0.0.0/0` (allow access from anywhere) OR add Vercel's IP ranges
- Database user has proper read/write permissions
- Connection string is correct and tested

#### 3. Middleware Warning
The build shows a warning about middleware deprecation. This is not critical and the middleware still works. Consider migrating to Next.js proxy in the future.

### 🚀 Deployment Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure the project (Next.js framework should be auto-detected)

3. **Add Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add all required variables from the list above
   - Click "Deploy"

4. **Post-Deployment Testing**
   - Test the homepage loads correctly
   - Test API routes by submitting a quote
   - Verify MongoDB connection works (check Vercel logs)
   - Test WhatsApp integration
   - Test PDF generation
   - Test JSON export

### 🧪 QA Testing Checklist

#### Frontend Tests
- [ ] Homepage loads without errors
- [ ] All 9 steps of the quote builder work correctly
- [ ] Language toggle (English/Sinhala) works
- [ ] WhatsApp button opens correctly
- [ ] PDF download generates correct document
- [ ] JSON export downloads correct file
- [ ] Form validation works on all steps
- [ ] All UI components render correctly on mobile and desktop

#### Backend/API Tests
- [ ] POST `/api/db` - Successfully saves quote to MongoDB
- [ ] GET `/api/db` - Successfully retrieves data from MongoDB
- [ ] PUT `/api/db` - Successfully updates documents
- [ ] DELETE `/api/db` - Successfully deletes documents
- [ ] API routes return proper error messages for invalid requests

#### Integration Tests
- [ ] Complete quote flow: Fill all steps → Save to DB → Download PDF
- [ ] Complete quote flow: Fill all steps → Save to DB → Send via WhatsApp
- [ ] Complete quote flow: Fill all steps → Save to DB → Download JSON
- [ ] Database records are created correctly
- [ ] No console errors in browser

#### Performance Tests
- [ ] Page load time is acceptable (<3 seconds)
- [ ] API responses are fast (<2 seconds)
- [ ] No memory leaks during extended use
- [ ] Images and assets are optimized

#### Security Tests
- [ ] Environment variables are not exposed in client-side code
- [ ] API routes validate input properly
- [ ] CORS headers are configured correctly
- [ ] Rate limiting works (middleware is active)
- [ ] Security headers are present (CSP, HSTS, etc.)

### 🔍 Monitoring and Debugging

#### Vercel Logs
Check real-time logs in Vercel dashboard:
- Go to your project → Deployments → Click on latest deployment → "View Logs"

#### Common Issues and Solutions

**Issue: MongoDB connection timeout**
- Solution: Check MongoDB Atlas network access settings, ensure IP whitelist includes Vercel

**Issue: Environment variables not working**
- Solution: Redeploy after adding variables, ensure variable names match exactly

**Issue: API routes return 500 error**
- Solution: Check Vercel logs for detailed error messages

**Issue: Build fails**
- Solution: Run `npm run build` locally to debug, check for TypeScript errors

### 📊 Performance Optimization

The project is already optimized with:
- Static generation for homepage
- Dynamic rendering for API routes
- Image optimization via Next.js
- CSS purging with Tailwind
- Code splitting and tree shaking

### 🔒 Security Considerations

1. **MongoDB Connection String** - Keep it secret, never commit to git
2. **API Rate Limiting** - Middleware provides basic protection
3. **Input Validation** - All API routes validate input
4. **CORS** - Configured via middleware
5. **Security Headers** - Configured in `next.config.ts`

### 📝 Additional Recommendations

1. **Set up Vercel Analytics** - Already integrated via `@vercel/analytics`
2. **Enable Vercel Speed Insights** - For performance monitoring
3. **Set up Error Monitoring** - Consider adding Sentry or similar
4. **Configure Custom Domain** - In Vercel project settings
5. **Enable Automatic HTTPS** - Automatic with Vercel

### 🆘 Support

If you encounter issues during deployment:
1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Test MongoDB connection locally with the same connection string
4. Review this guide's troubleshooting section

---

**Last Updated:** $(date)
**Build Status:** ✅ Successful
**Ready for Production:** Yes