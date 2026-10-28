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

## 6. Screenshots & UI Walkthrough

### 6.1 Authentication & Role-Based Login (`/login`)
- 1-Click viva demo login buttons (`Student (Vinay)`, `Faculty`, `Admin`).
- JWT token generation and automated local storage persistence.

```text
+--------------------------------------------------------------------------+
|  DSCE Student Feedback System                       [ Login ] [ Register ]|
+--------------------------------------------------------------------------+
|                                                                          |
|                   Welcome Back - Dayananda Sagar MCA                     |
|                                                                          |
|       [ Email: student1@dsce.edu           ]                             |
|       [ Password: ••••••••••••             ]                             |
|       [           Sign In Button           ]                             |
|                                                                          |
|       Quick Demo Auto-Fill:                                              |
|       [ 👤 Student (Vinay) ]   [ 👨‍🏫 Faculty ]   [ 🛡️ Admin ]             |
|                                                                          |
+--------------------------------------------------------------------------+
```

### 6.2 Student Course Selection (`/student/select-courses`)
- Grid display of active semester MCA courses with faculty names.
- Instant 1-click enrolment with duplicate prevention.

```text
+--------------------------------------------------------------------------+
| Select Your Semester Courses                                             |
| Enrol in courses to provide end-term faculty & curriculum evaluations.  |
|                                                                          |
|  +---------------------------+     +---------------------------+         |
|  | MMCA301 - Cloud Computing |     | MMCA302 - Full Stack Web  |         |
|  | Faculty: Dr. K. S. Sharma |     | Faculty: Dr. K. S. Sharma |         |
|  | Credits: 4 | Semester: 3  |     | Credits: 4 | Semester: 3  |         |
|  | [ Enrol in Course ]       |     | [ ✓ Enrolled ]            |         |
|  +---------------------------+     +---------------------------+         |
+--------------------------------------------------------------------------+
```

### 6.3 Interactive Feedback Submission Form (`/student/feedback`)
- Dynamic course dropdown filtered by enrolled courses.
- 1-5 star interactive rating with real-time feedback indicator.
- Minimum 10 characters comment validation with live character counter.

```text
+--------------------------------------------------------------------------+
| Course & Faculty Feedback Form                                           |
+--------------------------------------------------------------------------+
|  1. Select Enrolled Course:                                              |
|     [ MMCA302 - Full Stack Web Development (Dr. K. S. Sharma)    ▼ ]     |
|                                                                          |
|  2. Course & Faculty Rating (1 - 5 Stars) *                              |
|     ★ ★ ★ ★ ★   (5.0 - Excellent Teaching & Practical Labs)              |
|                                                                          |
|  3. Detailed Feedback & Comments *                                       |
|     +----------------------------------------------------------------+   |
|     | The hands-on labs and real-world project assignments helped us |   |
|     | understand full-stack architecture and git workflows deeply.   |   |
|     +----------------------------------------------------------------+   |
|     Rating is mandatory • Comments must be at least 10 chars.  [ 124 chars ]
|                                                                          |
|     [ Submit Feedback ]                                                  |
+--------------------------------------------------------------------------+
```

### 6.4 Student Feedback History (`/student/my-feedback`)
- Complete submission history with timestamp, star rating badge, and review comments.

### 6.5 Admin & Faculty Analytics Dashboard (`/admin/dashboard`)
- KPI summary metric cards (Total Courses, Total Feedback, Average Rating, Response Rate).
- Course Summary Table with average rating calculations.
- Detailed feedback submissions list with dynamic course dropdown filter.

---

## 7. REST API Endpoints & Specification

| Method | Endpoint | Access | Request Body / Query Params | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ name, email, password, role, semester }` | Register student or faculty |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Bearer Token | Headers: `Authorization: Bearer <token>` | Fetch logged-in user profile |
| `GET` | `/api/courses` | Bearer Token | None | List all MCA semester courses |
| `POST` | `/api/courses` | Admin | `{ code, title, description, credits, semester, faculty_id }` | Add new course |
| `GET` | `/api/courses/faculty-list` | Bearer Token | None | Dropdown list of faculty members |
| `POST` | `/api/student/courses` | Student | `{ course_id }` | Enrol student in course |
| `GET` | `/api/student/courses` | Student | None | Get courses enrolled by student |
| `POST` | `/api/feedback` | Student | `{ course_id, rating, comments }` | Submit feedback (rating mandatory, comments >= 10 chars) |
| `GET` | `/api/feedback/mine` | Student | None | View student's own submissions |
| `GET` | `/api/admin/summary` | Faculty/Admin | None | KPI metrics & course ratings summary |
| `GET` | `/api/admin/feedback` | Faculty/Admin | Optional query: `?courseId=1` | Granular feedback list with course filter |

---

## 8. Default Demo Login Credentials

The application is seeded with demo accounts for immediate testing:

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Admin DSCE | `admin@dsce.edu` | `Admin@123` |
| **Faculty** | Dr. K. S. Sharma | `faculty@dsce.edu` | `Faculty@123` |
| **Student 1** | N Vinay | `student1@dsce.edu` | `Student@123` |
| **Student 2** | Rahul Verma | `student2@dsce.edu` | `Student@123` |
| **Student 3** | Pooja Hegde | `student3@dsce.edu` | `Student@123` |

> **Viva Tip:** On the Login page (`http://localhost:5173/login`), click the quick buttons (`👤 Student (Vinay)`, `👨‍🏫 Faculty`, `🛡️ Admin`) to autofill and test each role without typing!

