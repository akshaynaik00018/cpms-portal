# Quick Start Guide

## Installation Steps

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env` file in backend folder:
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_placement
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running:
```bash
# macOS/Linux
sudo service mongod start

# Or if installed via brew (macOS)
brew services start mongodb-community

# Windows
net start MongoDB
```

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running at http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:3000

### 5. Access the Application

Open your browser and navigate to: **http://localhost:3000**

## First Time Setup

### Create Admin User
1. Click "Register" on the login page
2. Fill in the form with:
   - Name: Admin User
   - Email: admin@college.edu
   - Password: admin123
   - Role: **Select "Student" first** (Note: Admin registration might need to be done directly in DB)

**Or manually create admin in MongoDB:**
```javascript
// Open MongoDB shell
mongosh

use college_placement

// First, you need to hash the password
// Use the app's registration to create a student account, then update it to admin
db.users.updateOne(
  { email: "your_registered_email@example.com" },
  { $set: { role: "admin" } }
)
```

### Create Test Accounts

**Student Account:**
1. Register as Student
2. Fill in: Roll Number, Department, Batch, CGPA
3. Complete profile with skills and resume

**Company Account:**
1. Register as Company
2. Fill in: Company Name, Industry, Location
3. Wait for admin verification or verify manually:
```javascript
// In MongoDB shell
db.companies.updateOne(
  { companyName: "Your Company Name" },
  { $set: { isVerified: true } }
)
```

## Testing the Application

### As Student:
1. Login with student credentials
2. Navigate to "Jobs" to see available positions
3. Apply for jobs
4. Track applications in "Applications" tab
5. Check scheduled interviews in "Interviews" tab

### As Company:
1. Login with company credentials
2. Get verified by admin (or manually in DB)
3. Post a new job in "Job Postings"
4. Review applications in "Applications" tab
5. Shortlist/Select candidates

### As Admin:
1. Login with admin credentials
2. View analytics dashboard
3. Verify companies
4. Manage students, jobs, and users
5. View placement statistics

## Common Issues & Solutions

### Issue: MongoDB Connection Error
```bash
# Solution: Start MongoDB
sudo service mongod start

# Or check if MongoDB is installed
mongod --version
```

### Issue: Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: CORS Errors
Make sure both backend and frontend are running and the proxy is configured in `vite.config.js`

## Default Project URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## API Testing with Postman/Thunder Client

Import these sample requests:

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@college.edu",
  "password": "admin123"
}
```

**Get Jobs:**
```
GET http://localhost:5000/api/jobs
Authorization: Bearer YOUR_JWT_TOKEN
```

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review API endpoints in the README
- Check browser console for frontend errors
- Check terminal logs for backend errors

## Next Steps

1. ✅ Create your admin account
2. ✅ Register test student and company accounts
3. ✅ Post sample jobs as company
4. ✅ Apply for jobs as student
5. ✅ Explore the admin dashboard
6. ✅ Customize for your college needs

---

**Enjoy managing placements efficiently! 🎓💼**
