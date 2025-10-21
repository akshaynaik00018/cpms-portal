# College Placement Management System (MERN Stack)

A comprehensive web application for managing complete placement activities in engineering colleges. Built with MongoDB, Express.js, React, and Node.js.

## 🎯 Features

### For Students
- **Dashboard**: Overview of applications, interviews, and placement status
- **Profile Management**: Manage personal information, academic details, skills, and resume
- **Job Portal**: Browse and apply for eligible job opportunities
- **Application Tracking**: Track status of all job applications
- **Interview Management**: View and manage scheduled interviews
- **Eligibility Filtering**: Automatically see only jobs matching eligibility criteria

### For Companies
- **Dashboard**: Overview of job postings and applications
- **Profile Management**: Manage company information and HR contacts
- **Job Posting**: Create, edit, and manage job openings
- **Application Management**: Review student applications and shortlist candidates
- **Status Updates**: Update application status (Applied, Shortlisted, Selected, Rejected)
- **Candidate Details**: View detailed student profiles and resumes

### For Administrators
- **Analytics Dashboard**: Complete overview with charts and statistics
- **Student Management**: View and filter student records
- **Company Management**: Verify companies and manage company accounts
- **Job Management**: Monitor all job postings across companies
- **User Management**: Manage users, toggle status, and control access
- **Placement Statistics**: Track placement rates, packages, and top recruiters
- **Department-wise Reports**: View placement data by department

## 🚀 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **Date-fns** - Date formatting
- **Vite** - Build tool

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configurations
# - Set your MongoDB URI
# - Set a secure JWT secret
# - Configure other environment variables
```

**Backend .env Configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_placement
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if not running)
mongod

# Or if using MongoDB service
sudo service mongod start
```

The application will automatically create the database and collections on first run.

### 5. Seed Initial Admin User (Optional)

You can create an initial admin user by registering through the UI with role 'admin', or manually insert into MongoDB:

```javascript
// Connect to MongoDB shell
use college_placement

// Create admin user (password will be hashed by the application)
db.users.insertOne({
  name: "Admin User",
  email: "admin@college.edu",
  password: "$2a$10$...", // Use bcrypt to hash "admin123"
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 👥 Default User Roles & Demo Credentials

### Admin
- Email: `admin@college.edu`
- Password: `admin123`
- Access: Full system access, analytics, user management

### Student
- Email: `student@college.edu`
- Password: `student123`
- Access: Browse jobs, apply, track applications

### Company
- Email: `company@example.com`
- Password: `company123`
- Access: Post jobs, review applications

**Note:** Create these users through the registration page first.

## 📁 Project Structure

```
college-placement-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── interviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── companies.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   ├── interviews.js
│   │   └── admin.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Auth.css
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Jobs.jsx
│   │   │   │   ├── Applications.jsx
│   │   │   │   └── Interviews.jsx
│   │   │   ├── company/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Jobs.jsx
│   │   │   │   └── Applications.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Students.jsx
│   │   │       ├── Companies.jsx
│   │   │       ├── Jobs.jsx
│   │   │       └── Users.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students (Admin)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student profile
- `GET /api/students/dashboard/my` - Get student dashboard

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `PUT /api/companies/:id` - Update company profile
- `PUT /api/companies/:id/verify` - Verify company (Admin)
- `GET /api/companies/dashboard/my` - Get company dashboard

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/eligible` - Get eligible jobs for student
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (Company/Admin)
- `PUT /api/jobs/:id` - Update job (Company/Admin)
- `DELETE /api/jobs/:id` - Delete job (Company/Admin)

### Applications
- `GET /api/applications` - Get applications
- `POST /api/applications` - Apply for job (Student)
- `GET /api/applications/:id` - Get application by ID
- `PUT /api/applications/:id` - Update application status (Company/Admin)
- `DELETE /api/applications/:id` - Withdraw application (Student)

### Interviews
- `GET /api/interviews` - Get interviews
- `POST /api/interviews` - Schedule interview (Company/Admin)
- `GET /api/interviews/:id` - Get interview by ID
- `PUT /api/interviews/:id` - Update interview (Company/Admin)
- `DELETE /api/interviews/:id` - Cancel interview (Company/Admin)

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Key Features Implemented

1. **Role-Based Access Control (RBAC)**
   - Three user roles: Student, Company, Admin
   - Protected routes and API endpoints
   - Dynamic navigation based on role

2. **Authentication & Authorization**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Token-based session management
   - Protected routes on frontend and backend

3. **Student Features**
   - Eligibility-based job filtering
   - Application tracking with status updates
   - Interview scheduling and notifications
   - Profile management with resume upload

4. **Company Features**
   - Job posting with eligibility criteria
   - Application review and shortlisting
   - Interview scheduling
   - Company verification system

5. **Admin Features**
   - Comprehensive analytics dashboard
   - Charts for placement statistics
   - Department-wise placement tracking
   - User management (activate/deactivate)
   - Company verification

6. **Data Visualization**
   - Bar charts for department-wise data
   - Pie charts for status distribution
   - Real-time statistics
   - Interactive dashboards

7. **Modern UI/UX**
   - Responsive design for all devices
   - Clean and intuitive interface
   - Toast notifications for user feedback
   - Modal dialogs for forms
   - Loading states and error handling

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable management
- Role-based access control

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo service mongod status

# Start MongoDB
sudo service mongod start
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Future Enhancements

- Email notifications for interview schedules
- Resume parser integration
- Advanced analytics and reporting
- Export data to PDF/Excel
- Real-time chat between students and companies
- Document upload and management
- Calendar integration for interviews
- SMS notifications
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

Created with ❤️ for engineering college placement management.

## 📧 Support

For support, email support@example.com or create an issue in the repository.

---

**Note:** This is a complete working application ready for deployment. Make sure to:
1. Change all default passwords in production
2. Use strong JWT secrets
3. Configure proper MongoDB security
4. Set up HTTPS for production
5. Implement rate limiting for APIs
6. Add comprehensive logging
7. Set up backup strategies
