
import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  CalendarDays,
  Settings,
  Bell,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  CircleDashed,
  Video,
  Mic,
  MessageSquare,
  MoreHorizontal,
  X,
  User,
  ShieldCheck,
  BellRing
} from 'lucide-react'

import {
  getTasks,
  createTask,
  updateTaskStatus,
  getInterviews,
  createInterview
} from './api'

import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [role, setRole] = useState('Employer')

  const [tasks, setTasks] = useState([])
  const [interviews, setInterviews] = useState([])

  const [showForm, setShowForm] = useState(false)
  const [showInterviewForm, setShowInterviewForm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [readNotifications, setReadNotifications] = useState([])

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')

  const [candidateName, setCandidateName] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewMode, setInterviewMode] = useState('Video')

  const [loading, setLoading] = useState(true)
  const [interviewLoading, setInterviewLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [interviewSaving, setInterviewSaving] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [error, setError] = useState('')

  const VIRTUAL_HR_ID = 1

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError('Unable to load tasks. Please check the backend.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load interviews
  const loadInterviews = useCallback(async () => {
    try {
      const data = await getInterviews()
      setInterviews(data)
    } catch (err) {
      setError('Unable to load interviews. Please check the backend.')
      console.error(err)
    } finally {
      setInterviewLoading(false)
    }
  }, [])

  // Automatic refresh every 5 seconds
  useEffect(() => {
    loadTasks()
    loadInterviews()

    const interval = setInterval(() => {
      loadTasks()
      loadInterviews()
    }, 5000)

    return () => clearInterval(interval)
  }, [loadTasks, loadInterviews])

  // Filter tasks according to role
  const visibleTasks = role === 'Employer'
    ? tasks
    : tasks.filter(task => task.assigned_to === VIRTUAL_HR_ID)

  const completed = visibleTasks.filter(
    task => task.status === 'Completed'
  ).length

  const pending = visibleTasks.filter(
    task => task.status === 'Pending'
  ).length

  const inProgress = visibleTasks.filter(
    task => task.status === 'In Progress'
  ).length

  // Notifications from current tasks and interviews
  const notifications = [
    ...tasks.map(task => ({
      id: `task-${task.id}-${task.status}`,
      type: 'task',
      title: 'Task Activity',
      message: `${task.title} - ${task.status}`,
      date: task.deadline || '',
      icon: ClipboardList
    })),
    ...interviews.map(interview => ({
      id: `interview-${interview.id}`,
      type: 'interview',
      title: 'Interview Scheduled',
      message: `${interview.candidate_name} - ${interview.mode} Interview`,
      date: `${interview.interview_date} ${interview.interview_time}`,
      icon: CalendarDays
    }))
  ].slice().reverse().slice(0, 8)

  const unreadCount = notifications.filter(
    item => !readNotifications.includes(item.id)
  ).length

  // Mark one notification as read
  const markAsRead = (id) => {
    setReadNotifications(current =>
      current.includes(id) ? current : [...current, id]
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setReadNotifications(current => [
      ...new Set([
        ...current,
        ...notifications.map(item => item.id)
      ])
    ])
  }

  // Create task
  const addTask = async (e) => {
    e.preventDefault()

    if (!taskTitle.trim()) {
      setError('Please enter a task title.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await createTask({
        title: taskTitle.trim(),
        description: taskDescription.trim() || null,
        deadline: taskDeadline || null,
        assigned_to: VIRTUAL_HR_ID
      })

      await loadTasks()

      setTaskTitle('')
      setTaskDescription('')
      setTaskDeadline('')
      setShowForm(false)
    } catch (err) {
      setError('Unable to create task. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Update task status
  const changeStatus = async (id, currentStatus) => {
    const nextStatus = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Pending'
    }

    try {
      setUpdatingTaskId(id)
      setError('')

      await updateTaskStatus(id, nextStatus[currentStatus])
      await loadTasks()
    } catch (err) {
      setError('Unable to update task status.')
      console.error(err)
    } finally {
      setUpdatingTaskId(null)
    }
  }

  // Open interview form
  const openInterviewForm = (mode = 'Video') => {
    setInterviewMode(mode)
    setShowInterviewForm(true)
    setActiveTab('Interviews')
    setError('')
  }

  // Format time
  const formatTime = (time) => {
    if (!time) return ''

    const [hours, minutes] = time.split(':')
    const hour = Number(hours)
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12

    return `${String(formattedHour).padStart(2, '0')}:${minutes} ${suffix}`
  }

  // Schedule interview
  const scheduleInterview = async (e) => {
    e.preventDefault()

    if (!candidateName.trim() || !interviewDate || !interviewTime) {
      setError('Please fill in all interview details.')
      return
    }

    try {
      setInterviewSaving(true)
      setError('')

      await createInterview({
        candidate_name: candidateName.trim(),
        interview_date: interviewDate,
        interview_time: formatTime(interviewTime),
        mode: interviewMode
      })

      await loadInterviews()

      setCandidateName('')
      setInterviewDate('')
      setInterviewTime('')
      setInterviewMode('Video')
      setShowInterviewForm(false)
    } catch (err) {
      setError('Unable to schedule interview.')
      console.error(err)
    } finally {
      setInterviewSaving(false)
    }
  }

  // Switch role
  const switchRole = () => {
    setRole(current =>
      current === 'Employer' ? 'Virtual HR' : 'Employer'
    )
    setActiveTab('Dashboard')
    setShowNotifications(false)
  }

  // Unique candidates
  const uniqueCandidates = [
    ...new Map(
      interviews.map(item => [
        item.candidate_name.toLowerCase(),
        item
      ])
    ).values()
  ]

  // Task statistics
  const TaskStats = () => (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-icon purple"><ClipboardList /></div>
        <p>Total Tasks</p>
        <h2>{visibleTasks.length}</h2>
        <small>All visible tasks</small>
      </div>

      <div className="stat-card">
        <div className="stat-icon orange"><Clock /></div>
        <p>In Progress</p>
        <h2>{inProgress}</h2>
        <small>Currently being handled</small>
      </div>

      <div className="stat-card">
        <div className="stat-icon green"><CheckCircle2 /></div>
        <p>Completed</p>
        <h2>{completed}</h2>
        <small>Successfully completed</small>
      </div>

      <div className="stat-card">
        <div className="stat-icon blue"><CircleDashed /></div>
        <p>Pending</p>
        <h2>{pending}</h2>
        <small>Waiting to be started</small>
      </div>
    </div>
  )

  // Reusable task row
  const TaskRow = ({ task, detailed = false }) => (
    <div
      className="table-row"
      style={detailed ? {
        gridTemplateColumns: '2fr 1fr 1.2fr 0.8fr 1fr 0.7fr'
      } : undefined}
    >
      <div>
        <strong>{task.title}</strong>
        {task.description && (
          <small style={{
            display: 'block',
            color: '#777',
            marginTop: '5px'
          }}>
            {task.description}
          </small>
        )}
      </div>

      <span>
        {task.assigned_to === VIRTUAL_HR_ID
          ? 'Virtual HR'
          : 'Unassigned'}
      </span>

      {detailed && (
        <span>{task.deadline || 'Not set'}</span>
      )}

      <span className="priority medium">Medium</span>

      <span
        className={`status ${task.status.toLowerCase().replace(' ', '-')}`}
      >
        {task.status}
      </span>

      {role === 'Virtual HR' ? (
        <button
          className="action-btn"
          disabled={updatingTaskId === task.id}
          onClick={() => changeStatus(task.id, task.status)}
          title="Update task status"
        >
          <MoreHorizontal size={20} />
        </button>
      ) : (
        <span>—</span>
      )}
    </div>
  )

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">✦ salarite<span>.</span></div>

        <p className="menu-label">WORKSPACE</p>

        {[
          [LayoutDashboard, 'Dashboard'],
          [ClipboardList, 'Tasks'],
          [Users, 'Candidates'],
          [CalendarDays, 'Interviews']
        ].map(([Icon, label]) => (
          <button
            key={label}
            className={`nav-item ${activeTab === label ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(label)
              setShowNotifications(false)
            }}
          >
            <Icon size={19} /> {label}
          </button>
        ))}

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Settings')
              setShowNotifications(false)
            }}
          >
            <Settings size={19} /> Settings
          </button>

          <div className="profile">
            <div className="avatar">
              {role === 'Employer' ? 'HG' : 'HR'}
            </div>
            <div>
              <strong>
                {role === 'Employer' ? 'Harsh Gupta' : 'Virtual HR'}
              </strong>
              <small>{role}</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / </span>
            <strong>{activeTab}</strong>
          </div>

          <div className="top-actions">
            <button className="secondary-btn" onClick={switchRole}>
              Switch to {role === 'Employer' ? 'Virtual HR' : 'Employer'}
            </button>

            <button className="icon-btn" title="Search">
              <Search size={19} />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                onClick={() => setShowNotifications(current => !current)}
                title="Notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: '18px',
                    height: '18px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION PANEL */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: '-10px',
                  width: '340px',
                  maxWidth: '85vw',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  zIndex: 1000,
                  color: '#222',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong style={{ fontSize: '16px' }}>
                        Notifications
                      </strong>
                      <small style={{
                        display: 'block',
                        color: '#777',
                        marginTop: '4px'
                      }}>
                        {unreadCount} unread
                      </small>
                    </div>

                    <button
                      className="icon-btn"
                      onClick={() => setShowNotifications(false)}
                      title="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid #eee',
                    textAlign: 'right'
                  }}>
                    <button
                      onClick={markAllAsRead}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#635bdb',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div style={{
                    maxHeight: '350px',
                    overflowY: 'auto'
                  }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '30px 15px',
                        textAlign: 'center',
                        color: '#777'
                      }}>
                        <BellRing size={28} />
                        <p>No notifications yet.</p>
                      </div>
                    ) : (
                      notifications.map(item => {
                        const isRead = readNotifications.includes(item.id)
                        const Icon = item.icon

                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '14px 16px',
                              borderBottom: '1px solid #f1f1f1',
                              background: isRead ? '#fff' : '#f5f5ff',
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start'
                            }}
                          >
                            <div style={{
                              color: '#635bdb',
                              paddingTop: '3px'
                            }}>
                              <Icon size={19} />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <strong style={{ fontSize: '13px' }}>
                                {item.title}
                              </strong>

                              <p style={{
                                fontSize: '12px',
                                color: '#555',
                                margin: '5px 0'
                              }}>
                                {item.message}
                              </p>

                              {item.date && (
                                <small style={{
                                  color: '#888',
                                  fontSize: '11px'
                                }}>
                                  {item.date}
                                </small>
                              )}

                              {!isRead && (
                                <div>
                                  <button
                                    onClick={() => markAsRead(item.id)}
                                    style={{
                                      border: 'none',
                                      background: 'none',
                                      color: '#635bdb',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      padding: '5px 0'
                                    }}
                                  >
                                    Mark as read
                                  </button>
                                </div>
                              )}
                            </div>

                            {!isRead && (
                              <span style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: '#635bdb',
                                marginTop: '6px'
                              }} />
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="avatar">
              {role === 'Employer' ? 'HG' : 'HR'}
            </div>
          </div>
        </header>

        <section className="content">

          {error && (
            <p style={{ color: 'red', marginBottom: '15px' }}>
              {error}
            </p>
          )}

          {/* DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <>
              <div className="welcome">
                <div>
                  <p className="date">
                    {role === 'Employer'
                      ? 'EMPLOYER WORKSPACE'
                      : 'VIRTUAL HR WORKSPACE'}
                  </p>

                  <h1>
                    {role === 'Employer'
                      ? 'Good afternoon, Harsh 👋'
                      : 'Welcome, Virtual HR 👋'}
                  </h1>

                  <p>
                    {role === 'Employer'
                      ? "Here's what's happening with your Virtual HR today."
                      : 'View your assigned tasks and update their progress.'}
                  </p>
                </div>

                {role === 'Employer' && (
                  <button
                    className="primary-btn"
                    onClick={() => {
                      setActiveTab('Tasks')
                      setShowForm(true)
                    }}
                  >
                    <Plus size={18} /> Assign New Task
                  </button>
                )}
              </div>

              <TaskStats />

              <div className="section-heading">
                <div>
                  <h2>Recent Tasks</h2>
                  <p>Overview of your latest tasks.</p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={() => setActiveTab('Tasks')}
                >
                  View All Tasks
                </button>
              </div>

              <div className="task-table">
                <div className="table-header">
                  <span>TASK DETAILS</span>
                  <span>ASSIGNED TO</span>
                  <span>PRIORITY</span>
                  <span>STATUS</span>
                  <span>ACTION</span>
                </div>

                {loading ? (
                  <p style={{ padding: '20px' }}>Loading tasks...</p>
                ) : visibleTasks.length === 0 ? (
                  <p style={{ padding: '20px' }}>No tasks found.</p>
                ) : (
                  visibleTasks.slice(0, 5).map(task => (
                    <TaskRow key={task.id} task={task} />
                  ))
                )}
              </div>

              {role === 'Employer' && (
                <>
                  <div className="section-heading interview-heading">
                    <div>
                      <h2>Interview Overview</h2>
                      <p>Manage your upcoming candidate interviews.</p>
                    </div>

                    <button
                      className="secondary-btn"
                      onClick={() => setActiveTab('Interviews')}
                    >
                      View Interviews
                    </button>
                  </div>

                  <div className="interview-cards">
                    <div className="interview-card">
                      <Mic size={23} />
                      <h3>Voice Interview</h3>
                      <p>Schedule an audio interview.</p>
                      <button onClick={() => openInterviewForm('Voice')}>
                        Schedule Interview
                      </button>
                    </div>

                    <div className="interview-card">
                      <Video size={23} />
                      <h3>Video Interview</h3>
                      <p>Schedule a video interview.</p>
                      <button onClick={() => openInterviewForm('Video')}>
                        Schedule Interview
                      </button>
                    </div>

                    <div className="interview-card">
                      <MessageSquare size={23} />
                      <h3>Chat Interview</h3>
                      <p>Schedule a text-based interview.</p>
                      <button onClick={() => openInterviewForm('Chat')}>
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* TASKS */}
          {activeTab === 'Tasks' && (
            <>
              <div className="welcome">
                <div>
                  <p className="date">TASK MANAGEMENT</p>
                  <h1>
                    {role === 'Employer' ? 'Manage Tasks 👋' : 'My Tasks 👋'}
                  </h1>
                  <p>
                    {role === 'Employer'
                      ? 'Assign tasks and monitor Virtual HR progress.'
                      : 'View your assigned tasks and update their status.'}
                  </p>
                </div>

                {role === 'Employer' && (
                  <button
                    className="primary-btn"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus size={18} /> Assign New Task
                  </button>
                )}
              </div>

              <TaskStats />

              <div className="section-heading">
                <div>
                  <h2>All Tasks</h2>
                  <p>View and manage all workspace tasks.</p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={loadTasks}
                >
                  Refresh Tasks
                </button>
              </div>

              <div className="task-table">
                <div
                  className="table-header"
                  style={{
                    gridTemplateColumns: '2fr 1fr 1.2fr 0.8fr 1fr 0.7fr'
                  }}
                >
                  <span>TASK NAME</span>
                  <span>ASSIGNED TO</span>
                  <span>DEADLINE</span>
                  <span>PRIORITY</span>
                  <span>STATUS</span>
                  <span>ACTION</span>
                </div>

                {loading ? (
                  <p style={{ padding: '20px' }}>Loading tasks...</p>
                ) : visibleTasks.length === 0 ? (
                  <p style={{ padding: '20px' }}>
                    No tasks found. Assign a new task to get started.
                  </p>
                ) : (
                  visibleTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      detailed={true}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {/* CANDIDATES */}
          {activeTab === 'Candidates' && (
            <>
              <div className="welcome">
                <div>
                  <p className="date">CANDIDATE MANAGEMENT</p>
                  <h1>All Candidates 👋</h1>
                  <p>View candidates who have scheduled interviews.</p>
                </div>
              </div>

              <div className="stats">
                <div className="stat-card">
                  <div className="stat-icon purple"><Users /></div>
                  <p>Total Candidates</p>
                  <h2>{uniqueCandidates.length}</h2>
                  <small>Unique candidates</small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green"><CheckCircle2 /></div>
                  <p>Scheduled Interviews</p>
                  <h2>{interviews.length}</h2>
                  <small>All scheduled interviews</small>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Candidate List</h2>
                  <p>View candidate interview details.</p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={loadInterviews}
                >
                  Refresh Candidates
                </button>
              </div>

              <div className="task-table">
                <div className="table-header">
                  <span>CANDIDATE NAME</span>
                  <span>INTERVIEW DATE</span>
                  <span>TIME</span>
                  <span>MODE</span>
                  <span>STATUS</span>
                </div>

                {interviewLoading ? (
                  <p style={{ padding: '20px' }}>Loading candidates...</p>
                ) : uniqueCandidates.length === 0 ? (
                  <p style={{ padding: '20px' }}>
                    No candidates found. Schedule an interview first.
                  </p>
                ) : (
                  uniqueCandidates.map(interview => (
                    <div className="table-row" key={interview.id}>
                      <strong>{interview.candidate_name}</strong>
                      <span>{interview.interview_date}</span>
                      <span>{interview.interview_time}</span>
                      <span>{interview.mode}</span>
                      <span className="status completed">
                        {interview.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* INTERVIEWS */}
          {activeTab === 'Interviews' && (
            <>
              <div className="welcome">
                <div>
                  <p className="date">INTERVIEW MANAGEMENT</p>
                  <h1>Interview Scheduling 👋</h1>
                  <p>Schedule and manage candidate interviews.</p>
                </div>

                {role === 'Employer' && (
                  <button
                    className="primary-btn"
                    onClick={() => openInterviewForm('Video')}
                  >
                    <Plus size={18} /> Schedule Interview
                  </button>
                )}
              </div>

              <div className="section-heading">
                <div>
                  <h2>Interview Modes</h2>
                  <p>Choose your preferred interview method.</p>
                </div>
              </div>

              <div className="interview-cards">
                <div className="interview-card">
                  <Mic size={23} />
                  <h3>Voice Interview</h3>
                  <p>Schedule an audio interview.</p>
                  <button onClick={() => openInterviewForm('Voice')}>
                    Schedule Interview
                  </button>
                </div>

                <div className="interview-card">
                  <Video size={23} />
                  <h3>Video Interview</h3>
                  <p>Schedule a video interview.</p>
                  <button onClick={() => openInterviewForm('Video')}>
                    Schedule Interview
                  </button>
                </div>

                <div className="interview-card">
                  <MessageSquare size={23} />
                  <h3>Chat Interview</h3>
                  <p>Schedule a text-based interview.</p>
                  <button onClick={() => openInterviewForm('Chat')}>
                    Schedule Interview
                  </button>
                </div>
              </div>

              <div className="section-heading interview-heading">
                <div>
                  <h2>Scheduled Interviews</h2>
                  <p>View all interviews saved in the system.</p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={loadInterviews}
                >
                  Refresh Interviews
                </button>
              </div>

              <div className="task-table">
                <div className="table-header">
                  <span>CANDIDATE</span>
                  <span>DATE</span>
                  <span>TIME</span>
                  <span>MODE</span>
                  <span>STATUS</span>
                </div>

                {interviewLoading ? (
                  <p style={{ padding: '20px' }}>Loading interviews...</p>
                ) : interviews.length === 0 ? (
                  <p style={{ padding: '20px' }}>
                    No interviews scheduled yet.
                  </p>
                ) : (
                  interviews.map(interview => (
                    <div className="table-row" key={interview.id}>
                      <strong>{interview.candidate_name}</strong>
                      <span>{interview.interview_date}</span>
                      <span>{interview.interview_time}</span>
                      <span>{interview.mode}</span>
                      <span className="status completed">
                        {interview.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* SETTINGS */}
          {activeTab === 'Settings' && (
            <>
              <div className="welcome">
                <div>
                  <p className="date">WORKSPACE CONFIGURATION</p>
                  <h1>Settings 👋</h1>
                  <p>Manage your profile and workspace information.</p>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Profile Information</h2>
                  <p>Your current workspace profile.</p>
                </div>
              </div>

              <div className="stats">
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <User />
                  </div>
                  <p>Profile Name</p>
                  <h2 style={{ fontSize: '20px' }}>
                    {role === 'Employer' ? 'Harsh Gupta' : 'Virtual HR'}
                  </h2>
                  <small>Current user</small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon blue">
                    <ShieldCheck />
                  </div>
                  <p>Workspace Role</p>
                  <h2 style={{ fontSize: '20px' }}>{role}</h2>
                  <small>Active workspace role</small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">
                    <CheckCircle2 />
                  </div>
                  <p>Connection Status</p>
                  <h2 style={{ fontSize: '20px' }}>
                    {loading || interviewLoading ? 'Loading' : 'Connected'}
                  </h2>
                  <small>API data status</small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orange">
                    <Clock />
                  </div>
                  <p>Auto Refresh</p>
                  <h2 style={{ fontSize: '20px' }}>5 Seconds</h2>
                  <small>Automatic data refresh</small>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Workspace Preferences</h2>
                  <p>Current application configuration.</p>
                </div>
              </div>

              <div className="task-table" style={{ padding: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <BellRing size={22} color="#635bdb" />
                  <div>
                    <strong>Notifications</strong>
                    <p style={{ color: '#777', fontSize: '13px' }}>
                      View task and interview activity using the bell icon.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <Clock size={22} color="#635bdb" />
                  <div>
                    <strong>Automatic Updates</strong>
                    <p style={{ color: '#777', fontSize: '13px' }}>
                      Tasks and interviews refresh automatically every 5 seconds.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <ShieldCheck size={22} color="#635bdb" />
                  <div>
                    <strong>Virtual HR Assignment</strong>
                    <p style={{ color: '#777', fontSize: '13px' }}>
                      Tasks are assigned to Virtual HR using workspace ID 1.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

        </section>
      </main>

      {/* ASSIGN TASK MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={addTask}>
            <h2>Assign New Task</h2>
            <p>Enter task details for Virtual HR.</p>

            <label>Task Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="e.g. Screen shortlisted candidates"
              required
            />

            <label>Task Description</label>
            <textarea
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              placeholder="Describe what Virtual HR needs to do..."
              rows="3"
            />

            <label>Deadline</label>
            <input
              type="date"
              value={taskDeadline}
              onChange={e => setTaskDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setShowForm(false)
                  setTaskTitle('')
                  setTaskDescription('')
                  setTaskDeadline('')
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Assign Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {showInterviewForm && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={scheduleInterview}>
            <h2>Schedule Interview</h2>
            <p>Enter candidate details to schedule an interview.</p>

            <label>Candidate Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
              required
            />

            <label>Interview Date</label>
            <input
              type="date"
              value={interviewDate}
              onChange={e => setInterviewDate(e.target.value)}
              required
            />

            <label>Interview Time</label>
            <input
              type="time"
              value={interviewTime}
              onChange={e => setInterviewTime(e.target.value)}
              required
            />

            <label>Interview Mode</label>
            <select
              value={interviewMode}
              onChange={e => setInterviewMode(e.target.value)}
            >
              <option value="Voice">Voice Interview</option>
              <option value="Video">Video Interview</option>
              <option value="Chat">Chat Interview</option>
            </select>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowInterviewForm(false)}
                disabled={interviewSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={interviewSaving}
              >
                {interviewSaving ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

export default App
