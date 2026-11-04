
const API_URL = "http://127.0.0.1:8000";

// Get all tasks
export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

// Create a task
export async function createTask(task) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

// Update task status
export async function updateTaskStatus(id, status) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

// Get users
export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

// Get all interviews
export async function getInterviews() {
  const response = await fetch(`${API_URL}/interviews`);
  if (!response.ok) throw new Error("Failed to fetch interviews");
  return response.json();
}

// Schedule a new interview
export async function createInterview(interview) {
  const response = await fetch(`${API_URL}/interviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interview),
  });

  if (!response.ok) {
    throw new Error("Failed to schedule interview");
  }

  return response.json();
}
