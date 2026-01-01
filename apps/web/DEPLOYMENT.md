# Railway Deployment Guide

## Prerequisites

- Railway account (https://railway.app)
- Supabase project with schema deployed
- GitHub repository connected to Railway

## Environment Variables

Configure the following environment variables in your Railway project settings:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gtidsunwacqkrpfwghdv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_FNSBfs9DvK0WqawFvY2TLg_jHQ3DIwS
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Cron Security
CRON_SECRET=XYpTB1SHx3WajkPry8cq9OnAvFwo5zQu

# Optional: AI & Market Data (for future use)
GEMINI_API_KEY=<your-gemini-key>
ALPACA_API_KEY=<your-alpaca-key>
ALPACA_API_SECRET=<your-alpaca-secret>
```

## Deploy to Railway

1. **Connect Repository**
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `apps/web`

2. **Configure Build**
   - Railway should auto-detect Next.js
   - Build command: `npm run build`
   - Start command: `npm run start`

3. **Set Environment Variables**
   - Go to project settings → Variables
   - Add all environment variables listed above
   - **Important**: Rotate the `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` from the exposed values in this guide

4. **Deploy**
   - Railway will automatically deploy on push to main branch
   - Monitor build logs for any errors

## Railway Cron Setup

Railway Cron allows you to schedule HTTP requests to your deployed endpoints.

1. **Create Cron Job**
   - In Railway dashboard, go to your project
   - Click "New" → "Cron Job"
   - Name: `generate-articles`

2. **Configure Schedule**
   - Schedule: `0 */2 * * *` (every 2 hours)
   - Or customize based on your needs (max 12 articles/day recommended)

3. **Configure HTTP Request**
   - Method: `POST`
   - URL: `https://your-app.railway.app/api/cron/generate-articles`
   - Headers:
     ```
     Content-Type: application/json
     x-cron-secret: XYpTB1SHx3WajkPry8cq9OnAvFwo5zQu
     ```
   - Body:
     ```json
     {}
     ```

4. **Optional: Breaking News Trigger**
   - Create a second cron job for breaking news
   - Schedule: `0 9,15 * * 1-5` (9 AM and 3 PM on weekdays)
   - Body:
     ```json
     {"isBreaking": true}
     ```

## Verify Deployment

1. **Health Check**
   ```bash
   curl https://your-app.railway.app/api/health
   ```
   Should return:
   ```json
   {
     "ok": true,
     "service": "web",
     "now": "2026-01-01T17:00:00.000Z",
     "env": {
       "hasSupabaseUrl": true,
       "hasSupabaseAnonKey": true,
       "hasSupabaseServiceRoleKey": true,
       "hasCronSecret": true
     }
   }
   ```

2. **Manual Article Generation** (for testing)
   ```bash
   curl -X POST https://your-app.railway.app/api/cron/generate-articles \
     -H "Content-Type: application/json" \
     -H "x-cron-secret: XYpTB1SHx3WajkPry8cq9OnAvFwo5zQu" \
     -d '{}'
   ```

3. **View Articles**
   - Visit `https://your-app.railway.app/news`
   - Verify articles are listed and clickable

## Security Reminders

⚠️ **IMPORTANT**: The following credentials were exposed during development and MUST be rotated:

1. **Supabase Service Role Key**
   - Go to Supabase Dashboard → Settings → API
   - Generate new service role key
   - Update in Railway environment variables

2. **CRON_SECRET**
   - Generate new random string (32+ alphanumeric characters)
   - Update in Railway environment variables
   - Update in Railway Cron job headers

## Monitoring

- **Railway Logs**: Monitor application logs in Railway dashboard
- **Supabase Logs**: Check database queries and RLS policy hits
- **Article Count**: Monitor daily article generation via `/api/health` or Supabase dashboard

## Troubleshooting

### Articles not generating
- Check Railway Cron job execution logs
- Verify `CRON_SECRET` matches between env vars and cron job headers
- Check Supabase connection and RLS policies

### 401 Unauthorized on cron endpoint
- Verify `x-cron-secret` header is set correctly in Railway Cron
- Check `CRON_SECRET` environment variable is set

### Database errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase project is active and accessible
- Verify schema was deployed correctly

## Next Steps

1. Implement AI article generation with Gemini
2. Integrate Alpaca market data
3. Add markdown rendering with proper formatting
4. Implement SEO optimizations (JSON-LD, meta tags)
5. Add table of contents and ad insertion
