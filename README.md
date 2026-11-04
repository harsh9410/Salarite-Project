# Salarite – Virtual HR & ATS Platform

Salarite is a Virtual HR and Applicant Tracking System (ATS) designed to help employers manage HR tasks, track task progress, manage candidates, and schedule interviews.

## Features

### 1. Dashboard
- Overview of tasks and interviews.
- Task statistics and recent activity.

### 2. Task Management
- Employers can create and assign tasks to Virtual HR.
- Tasks include title, description, and deadline.
- Track task status: Pending, In Progress, and Completed.

### 3. Virtual HR Workspace
- Virtual HR can view assigned tasks.
- Update task progress and completion status.
- Employer can see task updates automatically.

### 4. Candidate Management
- View candidates based on scheduled interviews.

### 5. Interview Scheduling
- Schedule interviews using Voice, Video, and Chat modes.
- View scheduled interviews.

### 6. Settings and Notifications
- Workspace settings page.
- Activity notifications for tasks and interviews.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS
- Lucide React

**Backend**
- Python
- FastAPI
- SQLAlchemy
- SQLite

## Project Structure

```text
Salarite/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── api.js
│   └── package.json
│
├── backend/
│   ├── main.py
│   └── schemas.py
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Salarite
```

### 2. Start the Backend

```bash
cd backend
pip install fastapi uvicorn sqlalchemy
uvicorn main:app --reload
```

Backend URL: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## Demo Information

- Virtual HR User ID: 1
- Virtual HR Email: hr@salarite.com

No demo password is configured in this documentation.

## Current Scope

This project currently supports task management, task status updates, candidate listing based on scheduled interviews, and interview scheduling.

Voice, Video, and Chat are currently interview scheduling modes; actual calling functionality is not implemented.

## Future Improvements

- Real-time updates using WebSockets.
- Candidate registration and profile management.
- Actual voice and video interview integration.
- Authentication and role-based access control.
- Cloud deployment.

## Author

**Harsh Gupta**

GitHub: https://github.com/harsh9410

LinkedIn: https://www.linkedin.com/in/harsh-gupta-898852327/# Salarite
# Salarite-Project
