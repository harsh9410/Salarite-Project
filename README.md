# Salarite – Virtual HR & ATS Platform

Salarite is a Virtual HR and Applicant Tracking System (ATS) designed to help employers manage HR tasks, track progress, manage candidates, and schedule interviews.

## Live Demo

- **Frontend:** https://salarite-project-1.onrender.com
- **Backend API:** https://salarite-project.onrender.com
- **API Documentation:** https://salarite-project.onrender.com/docs

## Features

### 1. Dashboard
- Overview of tasks and interviews.
- Task statistics and recent activity.

### 2. Task Management
- Employers can create and assign tasks to Virtual HR.
- Tasks include title, description, and deadline.
- Track status: Pending, In Progress, and Completed.

### 3. Virtual HR Workspace
- View assigned tasks.
- Update task progress.
- Employers can see task updates automatically.

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
Salarite-Project/
├── Backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── api.js
│   ├── package.json
│   └── index.html
│
└── README.md
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/harsh9410/Salarite-Project.git
cd Salarite-Project
```

### 2. Start Backend

```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URL: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 3. Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

For local development, the frontend uses the local backend URL by default.

## Deployment

The project is deployed using Render.

- Frontend is deployed as a Static Site.
- Backend is deployed as a Python Web Service.
- Frontend connects to the backend through the `VITE_API_URL` environment variable.

## Demo Information

- Virtual HR User ID: 1
- Virtual HR Email: hr@salarite.com
- No demo password is configured.

## Current Scope and Limitations

- Task management and status updates are implemented.
- Employer dashboard refreshes task information automatically.
- Candidate listing is based on scheduled interviews.
- Voice, Video, and Chat are interview scheduling modes; actual calling functionality is not implemented.
- Authentication and role-based access control are not implemented.
- Settings are currently display-only.
- Notifications are activity-based and are not stored as persistent notification history.

## Future Improvements

- WebSocket-based instant updates.
- Candidate registration and profile management.
- Actual voice and video interview integration.
- Authentication and role-based access control.
- Persistent notification management.

## Author

**Harsh Gupta**

- GitHub: https://github.com/harsh9410
- LinkedIn: https://www.linkedin.com/in/harsh-gupta-898852327/
