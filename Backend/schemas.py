
from pydantic import BaseModel
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[str] = None
    assigned_to: Optional[int] = None


class TaskUpdate(BaseModel):
    status: str

class UserCreate(BaseModel):
    name: str
    email: str
    role: str


class InterviewCreate(BaseModel):
    candidate_name: str
    interview_date: str
    interview_time: str
    mode: str
