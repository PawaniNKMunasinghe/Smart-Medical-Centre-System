# Student Wellness Management System

A comprehensive university student health management platform built with Node.js, Express, MongoDB, and Next.js.

## Features

### User Roles
- **Students**: Book appointments, view prescriptions, track medicine consumption
- **Doctors**: Manage appointments, create prescriptions (Ayurvedic & English medicine)
- **Pharmacists**: Manage medicines inventory, issue medicines
- **Admin**: Manage users, publish news, generate reports

### Core Features

#### 1. Registration & Authentication
- Email/Password authentication with JWT tokens
- Role-based registration (Student, Doctor, Pharmacist)
- Auto-login after registration
- 7-day token expiration

#### 2. Doctor Features
- Two specializations: Ayurvedic and English Medicine
- Real-time availability status (Available/Away)
- Set working hours and appointment slot duration
- View student appointment requests
- Accept/Reject appointments
- Create prescriptions for students

#### 3. Student Features
- Search doctors by name and specialization
- Book appointments with date, time, and symptoms
- View prescription history
- Track medicine consumption with time tracking
- View medicine side effects and precautions
- Get appointment status updates

#### 4. Pharmacist Features
- View all medicines in inventory
- Add new medicines to database
- Manage medicine stock levels
- Issue medicines to students
- Track medicine details (dosage, form, manufacturer)

#### 5. Admin Features
- Manage all users (Create, Read, Update, Delete)
- Add news in 5 categories: Local, International, University, Health, Children
- Generate monthly reports (students affected, prescriptions issued)
- Dashboard with statistics

#### 6. Health Information Page
- Browse news by category
- Health tips and wellness information
- Child health information

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Date Utilities**: date-fns

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Toast Notifications**: react-hot-toast

## Project Structure

```
Student-Wellness-System/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Doctor.js
│   │   ├── Pharmacist.js
│   │   ├── Medicine.js
│   │   ├── Prescription.js
│   │   ├── Appointment.js
│   │   ├── News.js
│   │   └── HealthTips.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── doctors.js
│   │   ├── pharmacists.js
│   │   ├── admin.js
│   │   ├── medicines.js
│   │   ├── appointments.js
│   │   ├── prescriptions.js
│   │   └── news.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── authorize.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── login/
│   │   ├── register/
│   │   ├── health-info/
│   │   ├── dashboard/
│   │   │   ├── student/
│   │   │   ├── doctor/
│   │   │   ├── pharmacist/
│   │   │   └── admin/
│   │   └── globals.css
│   ├── components/
│   │   ├── navbar.js
│   │   └── [other components]
│   ├── context/
│   │   └── AuthContext.js
│   ├── utils/
│   │   └── api.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your credentials**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key_min_32_characters
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **How to get MongoDB Atlas URI**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get connection string and replace `<password>` with your database password
   - Copy the URI

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/prescriptions` - Get all prescriptions
- `GET /api/students/appointments` - Get all appointments
- `POST /api/students/appointments` - Book appointment
- `GET /api/students/search-doctors` - Search doctors
- `GET /api/students/medicine/:id/side-effects` - Get medicine details

### Doctors
- `GET /api/doctors/profile` - Get doctor profile
- `PUT /api/doctors/availability` - Update availability
- `GET /api/doctors/appointments` - Get all appointments
- `PUT /api/doctors/appointments/:id/accept` - Accept appointment
- `PUT /api/doctors/appointments/:id/reject` - Reject appointment
- `POST /api/doctors/prescriptions` - Create prescription
- `GET /api/doctors/search-student/:studentId` - Search student

### Pharmacists
- `GET /api/pharmacists/medicines` - Get all medicines
- `POST /api/pharmacists/medicines` - Add new medicine
- `PUT /api/pharmacists/medicines/:id` - Update medicine
- `POST /api/pharmacists/issue-medicine/:medicineId` - Issue medicine

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/news` - Add news
- `GET /api/admin/news` - Get all news
- `GET /api/admin/reports/monthly` - Get monthly report
- `GET /api/admin/stats` - Get dashboard statistics

### News & Health Info
- `GET /api/news` - Get news by category
- `GET /api/news/health-tips` - Get health tips

## Default Login Credentials

### For Testing:
- **Email**: student@example.com
- **Password**: password123
- **Role**: Student

(Create additional users via registration)

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (student|doctor|pharmacist|admin),
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Student
```javascript
{
  userId: ObjectId,
  studentId: String (unique),
  department: String,
  semester: Number,
  prescriptions: [ObjectId],
  appointments: [ObjectId],
  medicalHistory: Array,
  createdAt: Date
}
```

### Doctor
```javascript
{
  userId: ObjectId,
  doctorId: String (unique),
  specialization: String (Ayurvedic|English),
  qualifications: [String],
  experience: Number,
  availability: String (Available|Away),
  availableFrom: String (HH:MM),
  availableTill: String (HH:MM),
  appointmentSlotDuration: Number,
  appointments: [ObjectId],
  createdAt: Date
}
```

### Prescription
```javascript
{
  studentId: ObjectId,
  doctorId: ObjectId,
  medicines: [{
    medicineId: ObjectId,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String
  }],
  diagnosis: String,
  notes: String,
  issuedDate: Date,
  expiryDate: Date,
  isActive: Boolean,
  medicineTiming: [{
    medicine: String,
    time: String,
    taken: Boolean,
    date: Date
  }],
  createdAt: Date
}
```

### Appointment
```javascript
{
  studentId: ObjectId,
  doctorId: ObjectId,
  appointmentDate: Date,
  appointmentTime: String,
  symptoms: String,
  status: String (pending|accepted|rejected|completed|cancelled),
  notes: String,
  prescriptionId: ObjectId,
  rejectionReason: String,
  createdAt: Date
}
```

### Medicine
```javascript
{
  name: String,
  genericName: String,
  dosage: String,
  form: String,
  manufacturer: String,
  description: String,
  sideEffects: [String],
  precautions: [String],
  dosageInstructions: String,
  stock: Number,
  unit: String,
  issuedBy: [ObjectId],
  createdAt: Date
}
```

## Usage Guide

### For Students:
1. Register with student ID
2. Login to dashboard
3. Search for available doctors
4. Book appointments
5. View prescriptions and track medicine consumption
6. Check side effects of medicines

### For Doctors:
1. Register with doctor ID and specialization
2. Set availability status and working hours
3. Review appointment requests
4. Create prescriptions for students
5. Track patient interactions

### For Pharmacists:
1. Register with license number
2. Manage medicine inventory
3. Add new medicines with details
4. Issue medicines to students
5. Track stock levels

### For Admin:
1. Register (admin account must be created manually in database)
2. Manage all users
3. Add news and health tips
4. Generate monthly reports
5. View system statistics

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Authorization**: Middleware for role verification
- **Input Validation**: express-validator for data validation
- **CORS**: Configured for frontend URL only
- **HTTP Headers**: Security headers via Express

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string in .env
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure database user has correct permissions

### Port Already in Use
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# For Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors
- Check FRONTEND_URL in .env matches your frontend URL
- Ensure axios requests include Authorization header

### Token Expired
- Tokens expire after 7 days
- User needs to login again
- Token refreshing can be implemented for better UX

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email notifications for appointments
- [ ] Appointment reminders via SMS
- [ ] Payment integration for premium services
- [ ] Telemedicine video calls
- [ ] Medical records encryption
- [ ] Mobile application
- [ ] AI-based health recommendations
- [ ] Real-time notifications with WebSocket

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contact the development team

## Authors

- **Development Team** - Initial work and full implementation

## Acknowledgments

- MongoDB documentation
- Express.js documentation
- Next.js documentation
- React documentation
- All open-source contributors

---

**Last Updated**: 2026-06-07
**Version**: 1.0.0
