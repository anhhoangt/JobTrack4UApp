# Table of Contents
* [Jobtrack4U](#jobtrack4u)
* [Technologies and Implementations](#technologies-and-implementations)
* [Setup Instructions](#setup-instructions)
* [Usage](#usage)
* [Features](#features)
* [Project Structure](#project-structure)


## Jobtrack4U
The ultimate tool for job seekers to keep track of their job applications! Jobtrack4U is a comprehensive MERN stack application designed to help job seekers organize and manage their job search efficiently with advanced activity tracking, timeline views, and document management.

View this project live [HERE](https://jobtrack4u.onrender.com/landing)

## Technologies and Implementations
### Backend
* **Node.js** - JavaScript runtime environment
* **Express.js** - Web application framework
* **MongoDB** - NoSQL database for data persistence
* **Mongoose** - ODM for MongoDB
* **JWT (JSON Web Tokens)** - Secure authentication
* **Bcrypt** - Password hashing
* **Express-async-errors** - Async error handling
* **Validator** - Data validation
* **Cloudinary** - Cloud-based file storage for resumes
* **Multer** - File upload handling middleware

### Frontend
* **React** - UI library with hooks
* **React Router v6** - Client-side routing
* **Axios** - HTTP client for API requests
* **Recharts** - Data visualization (bar charts & area charts)
* **React Icons** - Icon library
* **Styled Components** - CSS-in-JS styling
* **Context API** - Global state management

### Development Tools
* **Nodemon** - Auto-restart server during development
* **Concurrently** - Run multiple npm scripts simultaneously
* **dotenv** - Environment variable management

## Setup Instructions

### Prerequisites
* Node.js (v14 or higher)
* MongoDB account (or local MongoDB installation)
* Cloudinary account (for resume uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd JobTrack4UApp
```

2. **Install dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

3. **Environment Variables**

Create a `.env` file in the root directory:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=1d
NODE_ENV=development
PORT=5000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run the application**
```bash
# Run both frontend and backend concurrently
npm start

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

5. **Access the application**
* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:5000`

## Usage
* Create an account or sign in to access the job tracking dashboard
* Add job applications with detailed information including salary, deadlines, and more
* Track activities for each job application (emails, interviews, follow-ups)
* View chronological timeline of all your job search activities
* Upload and manage your resume with cloud storage
* Visualize application statistics with interactive charts
* Filter and search through your applications

## Features

### User Management
* ✅ **User Authentication** - Secure signup/signin with JWT tokens
* ✅ **Profile Management** - Update personal information (name, email, location)
* ✅ **Resume Upload** - Upload and manage resume with Cloudinary (PDF, DOC, DOCX)
* ✅ **Password Security** - Bcrypt encryption for passwords

### Job Application Tracking
* ✅ **Create Applications** - Add detailed job applications with:
  - Basic info: Position, Company, Location
  - Application details: Status, Type, Method
  - Dates: Application date, Deadline
  - Salary: Range with currency options
  - Additional: Description, Company website, Job posting URL
  - Organization: Categories, Tags, Priority levels
  - Notes: Personal observations
* ✅ **Edit Applications** - Update any job application details
* ✅ **Delete Applications** - Remove unwanted applications
* ✅ **Status Tracking** - Monitor application status (Pending, Interview, Declined, Offer)
* ✅ **Priority Levels** - Mark applications as High, Medium, or Low priority
* ✅ **Categories** - Organize jobs by type (Full-Stack, Frontend, Backend, etc.)
* ✅ **Tags** - Custom tags for better organization

### Activity Management
* ✅ **Activity Tracking** - Record all job search activities:
  - Application sent
  - Emails (sent/received)
  - Phone calls (made/received)
  - Interviews (scheduled/completed)
  - Follow-ups
  - Offers and rejections
  - Notes
* ✅ **Activity Templates** - Quick-create common activities
* ✅ **Contact Information** - Track contact person details for each activity
* ✅ **Scheduled Dates** - Set dates for upcoming activities
* ✅ **Reminders** - Add reminder dates for important tasks
* ✅ **Activity Status** - Mark activities as complete or pending
* ✅ **Edit Activities** - Update activity details anytime
* ✅ **Delete Activities** - Remove activities when needed
* ✅ **Activity Filters** - Filter by type, status, or job

### Timeline & Visualization
* ✅ **Timeline View** - Chronological display of all activities with:
  - Date grouping (Today, Yesterday, This Week, etc.)
  - Activity type icons and color coding
  - Priority badges
  - Job references
  - Completion status
* ✅ **View Modes** - Toggle between all activities or job-specific timelines
* ✅ **Statistics Dashboard** - Visual insights with:
  - Application count by status
  - Monthly application trends (last 6 months)
  - Interactive bar charts and area charts
  - Chart toggle for different visualizations

### Search & Filter
* ✅ **Advanced Search** - Find applications by:
  - Position or company name
  - Status (All, Pending, Interview, Declined, Offer)
  - Job type (All, Full-time, Part-time, Remote, Internship)
  - Sort options (Latest, Oldest, A-Z, Z-A)
* ✅ **Pagination** - Navigate through large datasets
* ✅ **Clear Filters** - Reset all filters with one click

### User Interface
* ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
* ✅ **Dark Theme Support** - Easy on the eyes
* ✅ **Interactive Charts** - Toggle between bar and area charts
* ✅ **Dropdown Navigation** - Easy access to profile and logout
* ✅ **Loading States** - Visual feedback during operations
* ✅ **Alert Notifications** - Success and error messages
* ✅ **Form Validation** - Client-side and server-side validation

### Security
* ✅ **JWT Authentication** - Secure token-based auth
* ✅ **Protected Routes** - Authorization middleware
* ✅ **Password Hashing** - Bcrypt encryption
* ✅ **Input Validation** - Prevent malicious data
* ✅ **Error Handling** - Comprehensive error management

## Project Structure

```
JobTrack4UApp/
├── client/                          # React frontend
│   ├── public/
│   └── src/
│       ├── assets/                  # Styles and wrappers
│       │   ├── css/                 # Custom CSS files
│       │   │   └── activities.css   # Activity & timeline styles
│       │   └── wrappers/            # Styled components
│       ├── components/              # Reusable React components
│       │   ├── Alert.js
│       │   ├── AreaChart.js
│       │   ├── BarChart.js
│       │   ├── ChartsContainer.js
│       │   ├── FormRow.js
│       │   ├── FormRowSelect.js
│       │   ├── Job.js
│       │   ├── JobInfo.js
│       │   ├── JobsContainer.js
│       │   ├── Loading.js
│       │   ├── Logo.js
│       │   ├── Navbar.js
│       │   ├── NavLinks.js
│       │   ├── PageBtnContainer.js
│       │   ├── SearchContainer.js
│       │   ├── SmallSidebar.js
│       │   ├── StatItem.js
│       │   └── StatsContainer.js
│       ├── context/                 # Global state management
│       │   ├── actions.js           # Action types
│       │   ├── appContext.js        # Context provider
│       │   └── reducer.js           # State reducer
│       ├── pages/                   # Page components
│       │   ├── dashboard/           # Protected pages
│       │   │   ├── Activities.js    # Activity list page
│       │   │   ├── AddActivity.js   # Create/edit activity
│       │   │   ├── AddJob.js        # Create/edit job
│       │   │   ├── AllJobs.js       # Job listings
│       │   │   ├── Profile.js       # User profile & resume
│       │   │   ├── SharedLayout.js  # Dashboard layout
│       │   │   ├── Stats.js         # Statistics dashboard
│       │   │   └── Timeline.js      # Activity timeline
│       │   ├── Error.js             # 404 page
│       │   ├── Landing.js           # Landing page
│       │   ├── ProtectedRoute.js    # Route guard
│       │   └── Register.js          # Login/signup
│       ├── utils/                   # Utility functions
│       ├── App.js                   # Main app component
│       └── index.js                 # Entry point
│
├── config/                          # Configuration files
│   └── cloudinaryConfig.js          # Cloudinary setup
│
├── controllers/                     # Business logic
│   ├── activitiesController.js      # Activity operations
│   ├── authController.js            # Authentication
│   ├── jobsController.js            # Job operations
│   └── resumeController.js          # Resume upload/delete
│
├── middleware/                      # Express middleware
│   ├── auth.js                      # JWT authentication
│   └── error-handler.js             # Error handling
│
├── models/                          # MongoDB schemas
│   ├── Activity.js                  # Activity model
│   ├── Job.js                       # Job model
│   └── User.js                      # User model
│
├── routes/                          # API routes
│   ├── activitiesRoutes.js          # Activity endpoints
│   ├── authRoutes.js                # Auth endpoints
│   ├── jobsRoutes.js                # Job endpoints
│   └── resumeRoutes.js              # Resume endpoints
│
├── .env                             # Environment variables
├── .gitignore                       # Git ignore file
├── package.json                     # Dependencies
├── server.js                        # Express server
└── README.MD                        # This file
```

## API Endpoints

### Authentication
* `POST /api/v1/auth/register` - Create new account
* `POST /api/v1/auth/login` - Login to account
* `PATCH /api/v1/auth/updateUser` - Update user profile

### Jobs (Protected)
* `GET /api/v1/jobs` - Get all user's jobs
* `POST /api/v1/jobs` - Create new job
* `GET /api/v1/jobs/stats` - Get job statistics
* `GET /api/v1/jobs/:id` - Get single job
* `PATCH /api/v1/jobs/:id` - Update job
* `DELETE /api/v1/jobs/:id` - Delete job

### Activities (Protected)
* `GET /api/v1/activities` - Get all activities
* `POST /api/v1/activities` - Create activity
* `GET /api/v1/activities/upcoming` - Get upcoming activities
* `GET /api/v1/activities/:id` - Get single activity
* `PATCH /api/v1/activities/:id` - Update activity
* `DELETE /api/v1/activities/:id` - Delete activity
* `PATCH /api/v1/activities/:id/complete` - Mark complete
* `PATCH /api/v1/activities/:id/incomplete` - Mark pending
* `GET /api/v1/activities/job/:jobId/timeline` - Get job timeline

### Resume (Protected)
* `GET /api/v1/resume` - Get resume info
* `POST /api/v1/resume/upload` - Upload resume
* `DELETE /api/v1/resume` - Delete resume

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open source and available under the [MIT License](LICENSE).

## Contact
For questions or feedback, please open an issue on GitHub.
