# College Placement Management Portal (MERN)

A full-stack MERN application to manage end-to-end placement workflows in an engineering college.

## Features
- Authentication: student, company, TPO/Admin roles
- Companies post jobs; students apply
- Manage applications: shortlist/reject, feedback
- Interviews scheduling and status
- Offers management
- Analytics summary and CSV export
- File uploads for resumes and company logos

## Quick start

1. Create `.env` files
   - `server/.env` (copy from `server/.env.example`)
   - root `.env` (copy from `.env.example`), optional for Vite

2. Install deps
```bash
cd server && npm i
cd ../client && npm i
```

3. Seed sample data
```bash
cd server && npm run seed
```

4. Run
```bash
# Terminal 1
cd server && npm run dev
# Terminal 2
cd client && npm run dev
```

Login with:
- student: alice@college.edu / password123
- company: hr@tesla.com / password123
- tpo: tpo@example.com / password123
