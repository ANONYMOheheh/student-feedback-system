# Online Student Feedback System

**Dayananda Sagar College of Engineering**  
**Department of Master of Computer Applications (MCA)**  
**Subject:** MMCA314D - Web Development using Full Stack Open  
**Student Name:** N VINAY  
**USN:** 1DS25MC051  

---

## 1. Project Description
The **Online Student Feedback System** is a secure, role-based full-stack web application designed for academic institutions to collect, analyze, and report student feedback for semester courses and faculty members. 

### Key Features:
- **Authentication & Security:** JWT (JSON Web Token) authentication with password hashing using `bcrypt`.
- **Role-Based Access Control:** Distinct workflows and interfaces for `student`, `faculty`, and `admin` roles.
- **Course Selection / Enrolment:** Students can browse available semester courses and select/enrol in them.
- **Interactive Feedback Submission:** Students can evaluate enrolled courses with a 1-5 star rating component, constructive comments, and instant feedback validation.
- **Duplicate Prevention:** Enforces one feedback submission per course per student at both the database level (`UNIQUE(student_id, course_id)`) and the UI level.
- **Student History:** Students can review their past feedback submissions, ratings, and timestamps.
- **Faculty / Admin Analytics Dashboard:** Real-time summary metrics (Total Courses, Total Feedback Responses, Overall Average Rating, Feedback Submission Rate), Course Summary table, and granular student feedback reports with course filter.
- **Admin Management:** Administrators can register new courses and assign faculty in-charge.
- **Auto-Initialization & Seeding:** On startup, the backend automatically creates the MySQL database (`student_feedback_db`), executes `schema.sql`, and inserts demo accounts, courses, and feedback rows if tables are empty.

---

## 2. Technology Stack

### Frontend (`/client`)
- **Library/Framework:** React 18 (built with Vite)
- **Routing:** `react-router-dom` (v7)
- **HTTP Client:** `axios` (with JWT interceptor)
- **Styling & UI:** Bootstrap 5.3 + Bootstrap Icons
- **Typography:** Inter (Google Fonts)

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Driver:** `mysql2` (Promise-based connection pool)
- **Authentication:** `jsonwebtoken` (JWT)
- **Password Security:** `bcrypt`
- **Environment Configuration:** `dotenv`
- **CORS:** `cors`

### Database
- **Engine:** MySQL 8.0+
- **Schema:** Relational schema with Foreign Keys and Unique constraints.

---

## 3. Folder Structure
```text
feedback-system/
├── README.md
├── server/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── schema.sql
│   └── src/
│       ├── config/
│       │   └── db.js            # MySQL2 connection pool setup
│       ├── middleware/
│       │   └── auth.js          # JWT verification & role authorization
│       ├── routes/
│       │   ├── auth.js          # Register, Login, Profile
│       │   ├── courses.js       # List courses, Add course
│       │   ├── student.js       # Course selection & enrolled courses
│       │   ├── feedback.js      # Submit feedback & student history
│       │   └── admin.js         # Summary metrics & filtered feedback
│       ├── utils/
│       │   └── initDb.js        # Auto database creation & data seeding
│       └── index.js             # Main Express server entry point
└── client/
    ├── package.json
    ├── vite.config.js           # Port 5173 and API proxy
    ├── index.html
    └── src/
        ├── api.js               # Axios client with Auth interceptor
        ├── App.jsx              # Main routes and protected layout
        ├── main.jsx             # React DOM root & Bootstrap import
        ├── index.css            # Custom design tokens & styling
        ├── context/
        │   └── AuthContext.jsx  # Global user authentication state
        ├── components/
        │   ├── Navbar.jsx       # Dynamic role-based navigation bar
        │   ├── Footer.jsx       # DSCE credentials & developer footer
        │   ├── ProtectedRoute.jsx # Role-based route guard
        │   └── StarRating.jsx   # 1-5 Star interactive & display component
        └── pages/
            ├── Login.jsx        # Login page with 1-click demo buttons
            ├── Register.jsx     # Student registration page
            ├── SelectCourses.jsx # Student course selection
            ├── GiveFeedback.jsx # 1-5 Star rating & comments form
            ├── MyFeedback.jsx   # Student feedback history
            ├── AdminDashboard.jsx # Analytics summary & filtered reports
            └── AddCourse.jsx    # Admin course addition form
```

---

## 4. Setup Steps

### Prerequisites
1. **Node.js** (v18 or higher) and **npm** installed.
2. **MySQL Server** (v8.0+) running on your machine.

### Step 1: Configure Environment Variables
Inside `feedback-system/server/`, verify or update `.env`:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=Root@123
DB_NAME=student_feedback_db
JWT_SECRET=dsce_mca_feedback_secret_key_2026
```
*(Note: Set `DB_PASSWORD` to your local MySQL root password. The server automatically creates the database `student_feedback_db` on start).*

### Step 2: Install Backend Dependencies
Open a terminal and run:
```bash
cd feedback-system/server
npm install
```

### Step 3: Install Frontend Dependencies
Open a second terminal and run:
```bash
cd feedback-system/client
npm install
```

---

## 5. Run Commands

### Start the Backend Server (Port 5000)
```bash
cd feedback-system/server
npm start
```
*Output will confirm database creation, schema setup, demo seeding, and server listening at `http://localhost:5000`.*

### Start the Frontend Client (Port 5173)
```bash
cd feedback-system/client
npm run dev
```
*Frontend will be accessible at: `http://localhost:5173`.*

---

## 6. REST API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT |
| `GET` | `/api/auth/me` | Logged in | Get current logged in user details |
| `GET` | `/api/courses` | Logged in | List all semester courses with faculty info |
| `POST` | `/api/courses` | Admin | Add a new course to the curriculum |
| `GET` | `/api/courses/faculty-list` | Logged in | Get list of faculty members for dropdown |
| `POST` | `/api/student/courses` | Student | Enrol in / select a course |
| `GET` | `/api/student/courses` | Student | Get enrolled courses for logged-in student |
| `POST` | `/api/feedback` | Student | Submit 1-5 star rating & comments for course |
| `GET` | `/api/feedback/mine` | Student | View submitted feedback history for student |
| `GET` | `/api/admin/summary` | Faculty/Admin | Course summary table with response count and average rating |
| `GET` | `/api/admin/feedback?courseId=` | Faculty/Admin | All feedback responses with optional course filter |

---

## 7. Default Demo Login Credentials

The application is seeded with demo accounts for immediate testing:

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Admin DSCE | `admin@dsce.edu` | `Admin@123` |
| **Faculty** | Dr. K. S. Sharma | `faculty@dsce.edu` | `Faculty@123` |
| **Student 1** | N Vinay | `student1@dsce.edu` | `Student@123` |
| **Student 2** | Rahul Verma | `student2@dsce.edu` | `Student@123` |
| **Student 3** | Pooja Hegde | `student3@dsce.edu` | `Student@123` |

> **Viva Tip:** On the Login page (`http://localhost:5173/login`), click the quick buttons (`👤 Student (Vinay)`, `👨‍🏫 Faculty`, `🛡️ Admin`) to autofill and test each role without typing!
