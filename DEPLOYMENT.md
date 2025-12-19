# TriScan AI - Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Steps:
1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Root Directory: Leave empty (monorepo structure)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

3. **Environment Variables**
   Add the following environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be available at `https://your-app.vercel.app`

---

## Backend Deployment (Render)

### Prerequisites
- Render account
- MongoDB Atlas account (for production database)

### Steps:
1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `triscan-ai-backend`
   - Region: Singapore (or closest to your users)
   - Branch: `master`
   - Root Directory: Leave empty
   - Runtime: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Plan: Free

3. **Environment Variables**
   Add the following environment variables in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-secure-random-jwt-secret-key>
   GROQ_API_KEY=<your-groq-api-key>
   FRONTEND_URL=https://your-app.vercel.app
   ```
   
   **Note:** Replace all values in `<angle brackets>` with your actual credentials.
   - MONGODB_URI format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`
   - JWT_SECRET: Generate a secure random string (min 32 characters)
   - Get GROQ_API_KEY from [Groq Console](https://console.groq.com/)

4. **MongoDB Atlas Setup**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Add database user
   - Whitelist Render IPs (or use 0.0.0.0/0 for all IPs)
   - Copy connection string and add to MONGODB_URI

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend will be available at `https://triscan-ai-backend.onrender.com`

---

## Post-Deployment

### Update Frontend API URL
1. Go to Vercel dashboard
2. Navigate to your project settings
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
4. Redeploy frontend

### Update Backend CORS
The backend is already configured to accept requests from your frontend URL via the `FRONTEND_URL` environment variable.

### Health Check
- Frontend: Visit `https://your-app.vercel.app`
- Backend: Visit `https://your-backend-url.onrender.com/api/test/health`

---

## Important Notes

1. **Free Tier Limitations**
   - Render free tier spins down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading for production use

2. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets in production
   - Keep API keys secure

3. **Database**
   - Use MongoDB Atlas for production
   - Enable backups
   - Monitor usage

4. **Monitoring**
   - Check Vercel Analytics for frontend
   - Check Render Logs for backend errors
   - Set up error tracking (Sentry, etc.)

---

## Automatic Deployments

Both Vercel and Render support automatic deployments:
- Vercel: Auto-deploys on push to `master` branch
- Render: Auto-deploys on push to `master` branch

---

## Troubleshooting

### Frontend Issues
- Check build logs in Vercel
- Verify environment variables are set
- Test API connection

### Backend Issues
- Check logs in Render dashboard
- Verify MongoDB connection string
- Check environment variables
- Test endpoints with Postman

### CORS Errors
- Verify FRONTEND_URL in backend environment variables
- Check that frontend is using correct API URL
