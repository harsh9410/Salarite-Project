
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status
import models
import schemas

app = FastAPI(
    title="Salarite Virtual HR",
    description="Task Management and Interview Scheduling",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Welcome to Salarite Virtual HR System!"}


# Assign task
@app.post("/tasks")
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):

    if task.assigned_to is not None:
        user = db.query(models.User).filter(
            models.User.id == task.assigned_to
        ).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

    new_task = models.Task(
        title=task.title,
        description=task.description,
        deadline=task.deadline,
        assigned_to=task.assigned_to
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {"message": "Task assigned successfully", "task": {
        "id": new_task.id,
        "title": new_task.title,
        "status": new_task.status
    }}


# View all tasks
@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


# Update task status
@app.patch("/tasks/{task_id}")
def update_task(
    task_id: int,
    update: schemas.TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    allowed_statuses = ["Pending", "In Progress", "Completed"]

    if update.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid task status")

    task.status = update.status
    db.commit()
    db.refresh(task)

    return {"message": "Task status updated", "task": task}

# Create Employer or Virtual HR user
@app.post("/users")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    if user.role not in ["Employer", "Virtual HR"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


# Get all users
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


# Schedule an interview
@app.post("/interviews")
def schedule_interview(
    interview: schemas.InterviewCreate,
    db: Session = Depends(get_db)
):

    if interview.mode not in ["Voice", "Video", "Chat"]:
        raise HTTPException(status_code=400, detail="Invalid interview mode")

    new_interview = models.Interview(
        candidate_name=interview.candidate_name,
        interview_date=interview.interview_date,
        interview_time=interview.interview_time,
        mode=interview.mode
    )

    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)

    return {
        "message": "Interview scheduled successfully",
        "interview": {
            "id": new_interview.id,
            "candidate_name": new_interview.candidate_name,
            "mode": new_interview.mode,
            "status": new_interview.status
        }
    }


# Get all interviews
@app.get("/interviews")
def get_interviews(db: Session = Depends(get_db)):
    return db.query(models.Interview).all()
