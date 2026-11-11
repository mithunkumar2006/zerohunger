# Deployment & Setup Guide

## Local Development

### Quick Start

```bash
# Terminal 1: Start Backend
node server/server.js
# Backend runs on http://localhost:5000

# Terminal 2: Start Frontend
cd frontend && npm start
# Frontend runs on http://localhost:5174
```

### Environment Variables

Create `.env` in project root:
```env
PORT=5000
NODE_ENV=development
```

## Frontend Build

```bash
cd frontend
npm run build  # Creates dist/ folder
npm run preview  # Preview production build locally
```

## Backend Dependencies

```bash
cd server
npm install
```

### Core Packages
- **express**: Web framework
- **cors**: Enable cross-origin requests
- **dotenv**: Load environment variables

## Production Deployment

### Option 1: Vercel (Frontend) + Heroku (Backend)

**Frontend on Vercel:**
```bash
cd frontend
npm install -g vercel
vercel
```

**Backend on Heroku:**
```bash
cd server
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

### Option 2: Docker + Cloud Run

**Dockerfile for Backend:**
```dockerfile
FROM node:18
WORKDIR /app
COPY server/ .
RUN npm install
EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
docker build -t food-rescue-api .
docker run -p 5000:5000 food-rescue-api
```

### Option 3: Traditional VPS

```bash
# SSH into VPS
ssh user@your-vps-ip

# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone your-repo-url
cd protothan

# Install dependencies
npm install
cd frontend && npm install && npm run build
cd ../server && npm install

# Use PM2 for process management
npm install -g pm2
pm2 start server/server.js --name "food-rescue-api"
pm2 start "npm start" --name "food-rescue-frontend"

# Setup Nginx reverse proxy
sudo apt-get install nginx
```

## Database Setup (MongoDB)

```bash
# Install MongoDB locally
# or use MongoDB Atlas (cloud)

# In server/server.js, add MongoDB connection:
```

```javascript
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);

const donationSchema = new mongoose.Schema({
  donor: String,
  foodName: String,
  quantity: String,
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);
```

## Environment Variables for Production

```env
# Backend
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Frontend (in .env.production)
VITE_API_URL=https://your-api-domain.com
VITE_GOOGLE_MAPS_KEY=your-key
VITE_GEMINI_API_KEY=your-key
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Build Frontend
        run: cd frontend && npm install && npm run build
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Security Checklist

- [ ] Enable HTTPS/SSL certificates
- [ ] Add rate limiting to APIs
- [ ] Implement JWT authentication
- [ ] Hash passwords with bcrypt
- [ ] Validate all input data
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Add API authentication middleware
- [ ] Implement logging & monitoring
- [ ] Regular security audits

## Performance Optimization

```bash
# Frontend optimizations
npm run build  # Creates optimized production build

# Enable gzip compression
npm install compression

# Add caching headers to API
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

## Monitoring & Logging

```bash
# Install PM2 monitoring
pm2 install pm2-auto-pull
pm2 install pm2-logrotate
pm2 monit

# View logs
pm2 logs food-rescue-api
```

## Scaling

1. **Horizontal Scaling**: Load balance multiple server instances
2. **Database**: Use MongoDB replication
3. **Cache**: Implement Redis for session/data caching
4. **CDN**: Serve frontend assets from CDN
5. **Async Jobs**: Use Bull/RabbitMQ for background tasks

## Rollback

```bash
# If deployment fails
git revert HEAD
npm run build
# Redeploy
```

## Support

For issues, check logs:
```bash
pm2 logs
heroku logs --tail
vercel logs
```
