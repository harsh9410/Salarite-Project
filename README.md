# Salarite – Virtual HR & ATS Platform

Salarite is a mini Virtual HR and Applicant Tracking System (ATS) platform that allows employers to assign tasks to Virtual HR, track task progress, and schedule candidate interviews.

## Live Demo

- **Frontend:** https://salarite-project-1.onrender.com
- **Backend API:** https://salarite-project.onrender.com
- **API Documentation:** https://salarite-project.onrender.com/docs

## Features

### Employer Dashboard
- Create and assign tasks to Virtual HR.
- View assigned tasks and their progress.
- Monitor task status updates automatically.
- Schedule candidate interviews.

### Virtual HR Dashboard
- View assigned tasks.
- Update task status (Pending, In Progress, Completed).
- View assigned task details.

### Interview Management
- Schedule candidate interviews.
- Select interview modes:
  - Voice
  - Video
  - Chat
- View scheduled interviews.
- View candidates based on scheduled interviews.

## Technology Stack

**Frontend:** React.js, Vite, JavaScript, CSS

**Backend:** Python, FastAPI

**Database:** SQLite, SQLAlchemy

**Deployment:** Render

**Updates:** Automatic polling / auto-refresh

## Project Structure

```text
Salarite-Project/
│
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

### 1. Clone the Repository

```bash
git clone https://github.com/harsh9410/Salarite-Project.git
cd Salarite-Project
```

### 2. Backend Setup

```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Demo Access

- No login or password is required.
- Open the live website directly.
- Use the dashboard option to switch between Employer and Virtual HR modes.
- Virtual HR Demo User ID: `1`
- Virtual HR Email: `hr@salarite.com`

## Workflow

1. Employer creates a task and assigns it to Virtual HR.
2. Virtual HR views the assigned task.
3. Virtual HR updates the task status.
4. Employer dashboard automatically refreshes and displays the updated status.
5. Employer schedules an interview using Voice, Video, or Chat mode.
6. Scheduled interviews are displayed in the interview list and Candidates section.

## Deployment Configuration

The frontend uses the following environment variable:

```env
VITE_API_URL=https://salarite-project.onrender.com
```

The backend is deployed as a Python Web Service on Render, and the frontend is deployed as a Static Site on Render.

## Current Limitations

- Voice, Video, and Chat are interview scheduling modes; actual calling functionality is not implemented.
- Authentication and role-based login are not implemented.
- Settings are currently display-only.
- Notifications are activity-based and are not stored as persistent notification history.
- SQLite uses the default Render filesystem; data persistence across restarts or redeployments is not guaranteed without persistent storage.

## Future Improvements

- Implement authentication and role-based access.
- Integrate actual voice and video calling.
- Add persistent notification history.
- Improve database persistence.
- Add advanced candidate and interview management.

## Author

**Harsh Gupta**

- GitHub: https://github.com/harsh9410
- LinkedIn: https://www.linkedin.com/in/harsh-gupta-898852327/

---

**Salarite – Virtual HR & ATS Platform**
