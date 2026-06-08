# Quick Start Guide - Student Wellness Management System

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free)
- Git

### Step 1: Get MongoDB Connection String (2 min)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free account)
3. Create a cluster (click "Create")
4. Create a database user
5. Get connection string and copy it
6. Replace `<password>` with your password

Example: `mongodb+srv://username:password@cluster0.mongodb.net/wellness?retryWrites=true&w=majority`

### Step 2: Setup Backend (1 min)

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env file and add:
# MONGODB_URI=your_copied_connection_string
# JWT_SECRET=my_super_secret_key_at_least_32_characters

# Install & start
npm install
npm run dev
```

✅ Backend running on: `http://localhost:5000`

### Step 3: Setup Frontend (1 min)

```bash
cd frontend

# Install & start
npm install
npm run dev
```

✅ Frontend running on: `http://localhost:3000`

### Step 4: Test the System (1 min)

1. Open `http://localhost:3000`
2. Click **"Register"**
3. Create account (choose any role)
4. Login with credentials
5. Explore the dashboard

---

## 📝 File Structure

```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Auth & authorization
├── server.js        # Express server
└── package.json

frontend/
├── app/             # Next.js pages
├── components/      # React components
├── context/         # Auth context
├── utils/           # API client
└── package.json
```

---

## 🔑 Default Test Accounts

### Already in Backend (after setup):
- **Email**: student@example.com
- **Password**: password123
- **Role**: Student

---

## 🌐 API Endpoints (Quick Reference)

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Students
```
GET    /api/students/profile
GET    /api/students/appointments
POST   /api/students/appointments
GET    /api/students/prescriptions
```

### Doctors
```
GET    /api/doctors/profile
PUT    /api/doctors/availability
GET    /api/doctors/appointments
POST   /api/doctors/prescriptions
```

### Pharmacists
```
GET    /api/pharmacists/medicines
POST   /api/pharmacists/medicines
PUT    /api/pharmacists/medicines/:id
```

### Admin
```
GET    /api/admin/users
POST   /api/admin/news
GET    /api/admin/reports/monthly
```

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Check if backend is running: `npm run dev` in backend folder
- Check if MongoDB URI is correct in .env
- Check if MongoDB IP whitelist includes your IP

### "API not found"
- Ensure both servers are running
- Check API endpoint URL in browser console
- Verify CORS is enabled (should be automatic)

### Port already in use
```bash
# For port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# For port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# For Windows, use Task Manager or:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📚 What Each Role Can Do

### 👨‍🎓 Student
- Search for doctors
- Book appointments
- View prescriptions
- Track medicine consumption
- View side effects

### 👨‍⚕️ Doctor
- View appointments
- Accept/Reject appointments
- Create prescriptions
- Search students
- Set availability

### 💊 Pharmacist
- Manage medicine inventory
- Add medicines
- Issue medicines
- Track stock

### 👨‍💼 Admin
- Manage all users
- Publish news
- View reports
- Dashboard statistics

---

## 🎨 Frontend Pages

### Public Pages
- `/` - Homepage
- `/about` - About page
- `/health-info` - Health news & tips
- `/contact` - Contact form
- `/login` - Login page
- `/register` - Registration page

### Student Dashboard
- `/dashboard/student` - Main dashboard
- `/dashboard/student/book-appointment` - Book appointment
- `/dashboard/student/search-doctors` - Find doctors
- `/dashboard/student/prescriptions` - View prescriptions

### Other Dashboards
- `/dashboard/doctor` - Doctor dashboard
- `/dashboard/pharmacist` - Pharmacist dashboard
- `/dashboard/admin` - Admin dashboard

---

## 🚢 Deployment

### Quick Deploy to Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Quick Deploy to Render (Backend)
1. Push to GitHub
2. Create Render account
3. Connect GitHub
4. Add environment variables
5. Deploy!

See `DEPLOYMENT.md` for detailed instructions

---

## 📊 Database Models

- **User** - All users (students, doctors, etc.)
- **Student** - Student profiles
- **Doctor** - Doctor profiles
- **Pharmacist** - Pharmacist profiles
- **Medicine** - Medicine catalog
- **Prescription** - Prescriptions issued
- **Appointment** - Appointment bookings
- **News** - News articles
- **HealthTips** - Health information

---

## 🔒 Security

✅ Password hashing (bcryptjs)
✅ JWT authentication
✅ Role-based authorization
✅ Input validation
✅ CORS protection
✅ Environment variables for secrets

---

## 📞 Support

1. Check README.md for detailed documentation
2. Check DEPLOYMENT.md for production setup
3. Review API endpoints in documentation
4. Check server logs for errors

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. ✅ Create a test account for each role
3. ✅ Test appointment booking
4. ✅ Test prescription creation
5. ✅ Deploy to production (see DEPLOYMENT.md)

---

## 💡 Pro Tips

- Use Postman to test API endpoints
- Check browser console for frontend errors
- Check terminal for backend errors
- MongoDB Compass to view database
- Use "npm run dev" for hot reload

---

**Happy coding! 🚀**

For detailed docs, see:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
