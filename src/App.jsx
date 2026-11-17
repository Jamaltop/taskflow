import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, FolderKanban, Calendar as CalendarIcon,
  Users, BarChart3, Bell, Settings, User, Plus, Search, Menu, X,
  ChevronRight, ChevronLeft, ChevronDown, Sun, Moon, Sparkles, ArrowRight,
  Clock, AlertCircle, CheckCircle2, Trash2, Edit3, Filter, GripVertical,
  MoreHorizontal, Download, RefreshCw, ExternalLink, Layers, Target,
  Zap, Shield, Globe, MapPin, Mail, Briefcase, Check, SlidersHorizontal,
  List, Columns, CalendarDays, ArrowUpRight, Command, RotateCcw, FolderPlus,
  Play, Star, MessageSquare
} from 'lucide-react';

// ============================================================================
// 1. INITIAL SEED DATA & CONSTANTS
// ============================================================================

const STORAGE_PREFIX = 'taskflow_v1_';

const INITIAL_USER = {
  id: 'usr-jamal',
  name: 'Jamal Aliyev',
  role: 'Principal Product Architect',
  email: 'jamal@taskflow.io',
  location: 'Baku, Azerbaijan',
  bio: 'Designing resilient distributed systems, developer tools, and high-craft product interfaces.',
  accent: '#4F46E5',
  avatarInitials: 'JA'
};

const INITIAL_TEAM = [
  {
    id: 'usr-jamal',
    name: 'Jamal Aliyev',
    role: 'Product Lead',
    department: 'Architecture',
    email: 'jamal@taskflow.io',
    location: 'Baku, AZ',
    status: 'online',
    color: '#4F46E5',
    initials: 'JA',
    capacityHours: 40
  },
  {
    id: 'usr-leyla',
    name: 'Leyla Mammadova',
    role: 'UI/UX Designer',
    department: 'Design Systems',
    email: 'leyla@taskflow.io',
    location: 'Baku, AZ',
    status: 'online',
    color: '#0EA5E9',
    initials: 'LM',
    capacityHours: 40
  },
  {
    id: 'usr-rashad',
    name: 'Rashad Hasanov',
    role: 'Frontend Architect',
    department: 'Core Web',
    email: 'rashad@taskflow.io',
    location: 'Berlin, DE',
    status: 'focus',
    color: '#10B981',
    initials: 'RH',
    capacityHours: 40
  },
  {
    id: 'usr-nigar',
    name: 'Nigar Guliyeva',
    role: 'Backend Engineer',
    department: 'Infrastructure',
    email: 'nigar@taskflow.io',
    location: 'London, UK',
    status: 'online',
    color: '#F59E0B',
    initials: 'NG',
    capacityHours: 40
  },
  {
    id: 'usr-tural',
    name: 'Tural Karimov',
    role: 'QA Lead',
    department: 'Reliability',
    email: 'tural@taskflow.io',
    location: 'Baku, AZ',
    status: 'offline',
    color: '#EC4899',
    initials: 'TK',
    capacityHours: 36
  }
];

const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    key: 'CORE',
    name: 'TaskFlow Engine v3.0',
    description: 'Real-time sync engine, optimistic UI mutations, and sub-50ms keyboard command architecture.',
    color: '#4F46E5',
    status: 'On Track',
    deadline: getRelativeDate(14),
    leadId: 'usr-jamal',
    memberIds: ['usr-jamal', 'usr-rashad', 'usr-nigar', 'usr-tural']
  },
  {
    id: 'proj-2',
    key: 'DSYS',
    name: 'Prism Design System',
    description: 'Accessible multi-theme component tokens, interactive SVG charts, and responsive mobile drawers.',
    color: '#0EA5E9',
    status: 'On Track',
    deadline: getRelativeDate(9),
    leadId: 'usr-leyla',
    memberIds: ['usr-leyla', 'usr-rashad', 'usr-jamal']
  },
  {
    id: 'proj-3',
    key: 'API',
    name: 'Enterprise Webhooks & SSO',
    description: 'SAML 2.0 single sign-on, granular RBAC permissions, and signed webhook event pipelines.',
    color: '#10B981',
    status: 'At Risk',
    deadline: getRelativeDate(5),
    leadId: 'usr-nigar',
    memberIds: ['usr-nigar', 'usr-jamal', 'usr-tural']
  },
  {
    id: 'proj-4',
    key: 'MOB',
    name: 'iOS & Android Companion',
    description: 'Offline-first mobile task capture, push notification digests, and biometric authentication.',
    color: '#F59E0B',
    status: 'On Track',
    deadline: getRelativeDate(24),
    leadId: 'usr-rashad',
    memberIds: ['usr-rashad', 'usr-leyla', 'usr-tural']
  }
];

const INITIAL_TASKS = [
  {
    id: 'TF-101',
    title: 'Architect optimistic state reconciliation layer',
    description: 'Implement conflict-free local state queue with automatic rollback and toast diagnostics.',
    projectId: 'proj-1',
    status: 'Done',
    priority: 'Urgent',
    dueDate: getRelativeDate(-2),
    assigneeId: 'usr-jamal',
    estimateHours: 8,
    subtasks: [
      { id: 'st-1', title: 'Define mutation schema', done: true },
      { id: 'st-2', title: 'Write localStorage persistence adapter', done: true }
    ]
  },
  {
    id: 'TF-102',
    title: 'Design high-contrast dark mode surface elevation tokens',
    description: 'Calibrate zinc neutral borders and focus rings for WCAG AAA readability across all viewports.',
    projectId: 'proj-2',
    status: 'Done',
    priority: 'High',
    dueDate: getRelativeDate(-1),
    assigneeId: 'usr-leyla',
    estimateHours: 6,
    subtasks: [
      { id: 'st-3', title: 'Audit light/dark contrast ratios', done: true },
      { id: 'st-4', title: 'Publish Figma variable library', done: true }
    ]
  },
  {
    id: 'TF-103',
    title: 'Implement Kanban drag-and-drop with touch fallback',
    description: 'Support HTML5 pointer drag-and-drop on desktop plus instant status move controls on mobile.',
    projectId: 'proj-1',
    status: 'In Progress',
    priority: 'Urgent',
    dueDate: getRelativeDate(1),
    assigneeId: 'usr-rashad',
    estimateHours: 10,
    subtasks: [
      { id: 'st-5', title: 'Column drop-zone highlighting', done: true },
      { id: 'st-6', title: 'Keyboard & mobile status switcher', done: false }
    ]
  },
  {
    id: 'TF-104',
    title: 'Build SAML 2.0 assertion validator & metadata parser',
    description: 'Verify X.509 certificates and map identity provider groups to TaskFlow workspace roles.',
    projectId: 'proj-3',
    status: 'In Progress',
    priority: 'Urgent',
    dueDate: getRelativeDate(2),
    assigneeId: 'usr-nigar',
    estimateHours: 12,
    subtasks: [
      { id: 'st-7', title: 'XML signature verification', done: true },
      { id: 'st-8', title: 'IdP session timeout enforcement', done: false }
    ]
  },
  {
    id: 'TF-105',
    title: 'Interactive SVG velocity & workload analytics charts',
    description: 'Build responsive area, donut, and comparative bar visualizations with hover tooltips.',
    projectId: 'proj-2',
    status: 'In Review',
    priority: 'High',
    dueDate: getRelativeDate(3),
    assigneeId: 'usr-leyla',
    estimateHours: 7,
    subtasks: [
      { id: 'st-9', title: '7D / 30D timeframe toggle', done: true },
      { id: 'st-10', title: 'Mobile viewport label scaling', done: true }
    ]
  },
  {
    id: 'TF-106',
    title: 'Automated E2E regression suite for 320px–1920px breakpoints',
    description: 'Verify zero horizontal overflow and touch target compliance across 8 standard viewport widths.',
    projectId: 'proj-1',
    status: 'In Review',
    priority: 'High',
    dueDate: getRelativeDate(2),
    assigneeId: 'usr-tural',
    estimateHours: 6,
    subtasks: [
      { id: 'st-11', title: 'iPhone SE (320px & 375px) layout checks', done: true },
      { id: 'st-12', title: 'Modal focus-trap assertions', done: false }
    ]
  },
  {
    id: 'TF-107',
    title: 'Webhook retry exponential backoff & dead-letter queue',
    description: 'Ensure guaranteed at-least-once delivery for task.updated and project.completed events.',
    projectId: 'proj-3',
    status: 'Backlog',
    priority: 'High',
    dueDate: getRelativeDate(4),
    assigneeId: 'usr-nigar',
    estimateHours: 9,
    subtasks: []
  },
  {
    id: 'TF-108',
    title: 'Global Command Palette (Cmd+K) fuzzy search index',
    description: 'Instant keyboard navigation across tasks, projects, team members, and workspace actions.',
    projectId: 'proj-1',
    status: 'Done',
    priority: 'Medium',
    dueDate: getRelativeDate(-3),
    assigneeId: 'usr-jamal',
    estimateHours: 5,
    subtasks: []
  },
  {
    id: 'TF-109',
    title: 'Mobile bottom quick-capture sheet & haptic feedback',
    description: 'Allow one-handed task creation with priority and due date presets on iOS and Android.',
    projectId: 'proj-4',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: getRelativeDate(6),
    assigneeId: 'usr-rashad',
    estimateHours: 8,
    subtasks: []
  },
  {
    id: 'TF-110',
    title: 'CSV & JSON workspace audit report generator',
    description: 'Client-side streaming export of task metrics, assignees, and completion timestamps.',
    projectId: 'proj-3',
    status: 'Done',
    priority: 'Low',
    dueDate: getRelativeDate(-4),
    assigneeId: 'usr-jamal',
    estimateHours: 4,
    subtasks: []
  },
  {
    id: 'TF-111',
    title: 'Calendar weekly time-blocking & event scheduler',
    description: 'Support seamless toggling between Month overview and 7-day Week schedule grids.',
    projectId: 'proj-2',
    status: 'Backlog',
    priority: 'Medium',
    dueDate: getRelativeDate(7),
    assigneeId: 'usr-leyla',
    estimateHours: 6,
    subtasks: []
  },
  {
    id: 'TF-112',
    title: 'Load test WebSocket presence cluster at 50k concurrent users',
    description: 'Benchmark memory footprint and p99 broadcast latency under simulated burst traffic.',
    projectId: 'proj-1',
    status: 'Backlog',
    priority: 'High',
    dueDate: getRelativeDate(10),
    assigneeId: 'usr-tural',
    estimateHours: 8,
    subtasks: []
  },
  {
    id: 'TF-113',
    title: 'Biometric FaceID / Passkey session unlock flow',
    description: 'Integrate WebAuthn hardware key support for enterprise workspace accounts.',
    projectId: 'proj-4',
    status: 'Backlog',
    priority: 'Low',
    dueDate: getRelativeDate(12),
    assigneeId: 'usr-nigar',
    estimateHours: 7,
    subtasks: []
  },
  {
    id: 'TF-114',
    title: 'Refine onboarding empty states & interactive product tour',
    description: 'Craft welcoming zero-data illustrations and guided workspace checklists.',
    projectId: 'proj-2',
    status: 'Done',
    priority: 'Medium',
    dueDate: getRelativeDate(-1),
    assigneeId: 'usr-leyla',
    estimateHours: 4,
    subtasks: []
  }
];

const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Q4 Architecture & Sprint Planning',
    date: getRelativeDate(0),
    time: '10:30',
    type: 'meeting',
    projectId: 'proj-1',
    notes: 'Review v3.0 release milestones and performance budgets.'
  },
  {
    id: 'evt-2',
    title: 'Prism Design System Critique',
    date: getRelativeDate(2),
    time: '15:00',
    type: 'review',
    projectId: 'proj-2',
    notes: 'Sign off on mobile drawer ergonomics and chart color tokens.'
  },
  {
    id: 'evt-3',
    title: 'Enterprise SSO Security Audit',
    date: getRelativeDate(4),
    time: '11:00',
    type: 'milestone',
    projectId: 'proj-3',
    notes: 'External penetration test walkthrough with Nigar and Tural.'
  },
  {
    id: 'evt-4',
    title: 'TaskFlow v3.0 Release Candidate Freeze',
    date: getRelativeDate(7),
    time: '17:00',
    type: 'milestone',
    projectId: 'proj-1',
    notes: 'All P0/P1 issues resolved; cut release branch.'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'mention',
    title: 'Leyla Mammadova mentioned you in TF-105',
    body: '"@Jamal ready for your final review on the interactive SVG analytics charts."',
    time: '14m ago',
    unread: true,
    taskId: 'TF-105'
  },
  {
    id: 'notif-2',
    type: 'deadline',
    title: 'Upcoming Deadline: TF-103 due tomorrow',
    body: 'Implement Kanban drag-and-drop with touch fallback is currently In Progress.',
    time: '1h ago',
    unread: true,
    taskId: 'TF-103'
  }
];

const INITIAL_ACTIVITY = [
  { id: 'act-1', actor: 'Jamal Aliyev', action: 'completed', target: 'TF-101 Optimistic state layer', time: '22 mins ago' },
  { id: 'act-2', actor: 'Leyla Mammadova', action: 'moved to In Review', target: 'TF-105 SVG analytics charts', time: '1 hour ago' }
];

const STATUSES = ['Backlog', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['Urgent', 'High', 'Medium', 'Low'];

const PRIORITY_STYLES = {
  Urgent: 'bg-rose-500/12 text-rose-600 dark:text-rose-400 border-rose-500/25',
  High: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25',
  Medium: 'bg-sky-500/12 text-sky-700 dark:text-sky-400 border-sky-500/25',
  Low: 'bg-slate-500/12 text-slate-600 dark:text-zinc-400 border-slate-500/25'
};

const STATUS_DOT = {
  Backlog: 'bg-slate-400',
  'In Progress': 'bg-indigo-500',
  'In Review': 'bg-amber-500',
  Done: 'bg-emerald-500'
};

function usePersistedState(key, defaultValue) {
  const fullKey = STORAGE_PREFIX + key;
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(fullKey);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(state));
    } catch (err) {
      console.error('LocalStorage write failed:', err);
    }
  }, [fullKey, state]);

  return [state, setState];
}

export default function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 380);
    return () => clearTimeout(timer);
  }, []);

  // Theme & Accessibility States
  const [themeMode, setThemeMode] = usePersistedState('themeMode', 'dark'); // dark | light | cyberpunk
  const [fontSize, setFontSize] = usePersistedState('fontSize', 14); // 12, 14, 16, 18, 20
  const [lineSpacing, setLineSpacing] = usePersistedState('lineSpacing', 'normal'); // normal | relaxed | loose
  const [activePage, setActivePage] = usePersistedState('activePage', 'dashboard'); // landing, dashboard, tasks, projects, calendar, team, analytics, games, notifications, settings, profile
  const [workspaceName, setWorkspaceName] = usePersistedState('workspaceName', 'TaskFlow HQ');
  const [compactMode, setCompactMode] = usePersistedState('compactMode', false);
  const [defaultTaskView, setDefaultTaskView] = usePersistedState('defaultTaskView', 'board');
  const [notifPrefs, setNotifPrefs] = usePersistedState('notifPrefs', {
    mentions: true,
    deadlines: true,
    statusChanges: true,
    weeklyDigest: false
  });

  const [user, setUser] = usePersistedState('user', INITIAL_USER);
  const [team, setTeam] = usePersistedState('team', INITIAL_TEAM);
  const [projects, setProjects] = usePersistedState('projects', INITIAL_PROJECTS);
  const [tasks, setTasks] = usePersistedState('tasks', INITIAL_TASKS);
  const [events, setEvents] = usePersistedState('events', INITIAL_EVENTS);
  const [notifications, setNotifications] = usePersistedState('notifications', INITIAL_NOTIFICATIONS);
  const [activity, setActivity] = usePersistedState('activity', INITIAL_ACTIVITY);

  useEffect(() => {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === user.id
          ? {
              ...m,
              name: user.name,
              role: user.role,
              email: user.email,
              location: user.location,
              color: user.accent,
              initials: user.name
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            }
          : m
      )
    );
  }, [user, setTeam]);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [taskModalState, setTaskModalState] = useState({ open: false, task: null, defaultStatus: 'Backlog', defaultProjectId: 'proj-1', defaultDate: '' });
  const [projectModalState, setProjectModalState] = useState({ open: false, project: null });
  const [selectedProjectDetailId, setSelectedProjectDetailId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const recordActivity = (action, target, createNotif = false, taskId = null) => {
    setActivity((prev) => [
      { id: `act-${Date.now()}`, actor: user.name, action, target, time: 'Just now' },
      ...prev.slice(0, 19)
    ]);
    if (createNotif && notifPrefs.statusChanges) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'system',
          title: `${user.name} ${action} ${target}`,
          body: 'Workspace state synchronized across all views.',
          time: 'Just now',
          unread: true,
          taskId
        },
        ...prev
      ]);
    }
  };

  const handleSaveTask = (taskPayload) => {
    if (taskPayload.id) {
      setTasks((prev) => prev.map((t) => (t.id === taskPayload.id ? taskPayload : t)));
      recordActivity('updated', `${taskPayload.id} ${taskPayload.title}`, taskPayload.status === 'Done', taskPayload.id);
      showToast(`Updated ${taskPayload.id}`);
    } else {
      const nextNum =
        tasks.reduce((max, t) => {
          const n = parseInt(t.id.replace(/\D/g, ''), 10);
          return !isNaN(n) && n > max ? n : max;
        }, 100) + 1;
      const newTask = { ...taskPayload, id: `TF-${nextNum}` };
      setTasks((prev) => [newTask, ...prev]);
      recordActivity('created task', `${newTask.id} ${newTask.title}`, true, newTask.id);
      showToast(`Created ${newTask.id}`);
    }
    setTaskModalState({ open: false, task: null, defaultStatus: 'Backlog', defaultProjectId: 'proj-1', defaultDate: '' });
  };

  const handleMoveTaskStatus = (taskId, newStatus) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.status === newStatus) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    recordActivity(`moved to ${newStatus}`, `${taskId} ${targetTask.title}`, newStatus === 'Done', taskId);
    showToast(`${taskId} moved to ${newStatus}`);
  };

  const handleDeleteTask = (taskId) => {
    setConfirmDialog({
      open: true,
      title: `Delete ${taskId}?`,
      message: 'This task and its subtasks will be permanently removed from your workspace.',
      onConfirm: () => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        recordActivity('deleted task', taskId);
        showToast(`${taskId} deleted`, 'info');
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
        setTaskModalState({ open: false, task: null, defaultStatus: 'Backlog', defaultProjectId: 'proj-1', defaultDate: '' });
      }
    });
  };

  const handleSaveProject = (projPayload) => {
    if (projPayload.id) {
      setProjects((prev) => prev.map((p) => (p.id === projPayload.id ? projPayload : p)));
      recordActivity('updated project', projPayload.name);
      showToast(`Project "${projPayload.name}" updated`);
    } else {
      const newProj = { ...projPayload, id: `proj-${Date.now()}` };
      setProjects((prev) => [...prev, newProj]);
      recordActivity('launched project', newProj.name, true);
      showToast(`Project "${newProj.name}" created`);
    }
    setProjectModalState({ open: false, project: null });
  };

  const handleDeleteProject = (projectId) => {
    const proj = projects.find((p) => p.id === projectId);
    setConfirmDialog({
      open: true,
      title: `Delete "${proj?.name || 'Project'}"?`,
      message: 'This will remove the project and unassign associated tasks.',
      onConfirm: () => {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
        if (selectedProjectDetailId === projectId) setSelectedProjectDetailId(null);
        recordActivity('archived project', proj?.name || projectId);
        showToast('Project deleted', 'info');
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  const handleResetDemoData = () => {
    setConfirmDialog({
      open: true,
      title: 'Reset Workspace Demo Data?',
      message: 'All custom tasks, projects, events, and profile edits will be restored to factory defaults.',
      onConfirm: () => {
        setUser(INITIAL_USER);
        setTeam(INITIAL_TEAM);
        setProjects(INITIAL_PROJECTS);
        setTasks(INITIAL_TASKS);
        setEvents(INITIAL_EVENTS);
        setNotifications(INITIAL_NOTIFICATIONS);
        setActivity(INITIAL_ACTIVITY);
        setWorkspaceName('TaskFlow HQ');
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
        showToast('Workspace reset to default seed data');
      }
    });
  };

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  // Theme & Font Styles Mapping
  const isDark = themeMode === 'dark';
  const isCyber = themeMode === 'cyberpunk';

  const theme = {
    bgApp: isCyber
      ? 'bg-[#05050A] text-[#00FFCC]'
      : isDark
      ? 'bg-[#09090B] text-[#F4F4F5]'
      : 'bg-[#F8FAFC] text-[#0F172A]',
    bgSidebar: isCyber
      ? 'bg-[#0A0A12] border-[#00FFCC]/30'
      : isDark
      ? 'bg-[#0D0D10] border-zinc-800/80'
      : 'bg-white border-slate-200/80',
    bgCard: isCyber
      ? 'bg-[#0F0F1A] border-[#00FFCC]/30 shadow-[0_0_15px_rgba(0,255,204,0.1)]'
      : isDark
      ? 'bg-[#121216] border-zinc-800/80'
      : 'bg-white border-slate-200/80',
    bgSubtle: isCyber ? 'bg-[#141424]' : isDark ? 'bg-zinc-900/70' : 'bg-slate-100/80',
    textMuted: isCyber ? 'text-[#00FFCC]/70' : isDark ? 'text-zinc-400' : 'text-slate-500',
    border: isCyber ? 'border-[#00FFCC]/30' : isDark ? 'border-zinc-800/80' : 'border-slate-200/80',
    hoverRow: isCyber ? 'hover:bg-[#00FFCC]/10' : isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50',
    accentColor: isCyber ? '#00FFCC' : '#4F46E5'
  };

  const spacingClass = lineSpacing === 'loose' ? 'leading-loose' : lineSpacing === 'relaxed' ? 'leading-relaxed' : 'leading-normal';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: tasks.filter((t) => t.status !== 'Done').length },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projects.length },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'games', label: 'Mini Games', icon: Play, badge: 'New' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const navigate = (pageId) => {
    setActivePage(pageId);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activePage === 'landing') {
    return (
      <div
        className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${theme.bgApp}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        <LandingPageView
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          onLaunchApp={(targetPage = 'dashboard') => navigate(targetPage)}
          tasksCount={tasks.length}
          projectsCount={projects.length}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex overflow-x-hidden transition-colors duration-200 ${theme.bgApp} ${spacingClass}`}
      style={{ fontSize: `${fontSize}px`, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .font-mono-code { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(113, 113, 122, 0.35); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(79, 70, 229, 0.7); }
      `}</style>

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r z-30 ${theme.bgSidebar}`}>
        <div className={`h-16 px-5 flex items-center justify-between border-b ${theme.border}`}>
          <button onClick={() => navigate('dashboard')} className="flex items-center gap-2.5 text-left focus:outline-none group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm tracking-tight block truncate">{workspaceName}</span>
              <span className={`text-[10px] uppercase tracking-wider font-medium block ${theme.textMuted}`}>
                {isCyber ? 'CYBER-OS v3.0' : 'Enterprise Cloud'}
              </span>
            </div>
          </button>
        </div>

        <div className="px-3.5 pt-4 pb-2">
          <button
            onClick={() => setCommandOpen(true)}
            className={`w-full min-h-[38px] px-3 rounded-lg border ${theme.border} ${theme.bgSubtle} flex items-center justify-between text-xs ${theme.textMuted} hover:border-indigo-500/50 transition`}
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" /> Quick search...
            </span>
            <kbd className="font-mono-code text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">⌘K</kbd>
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full min-h-[40px] px-3 rounded-lg flex items-center justify-between text-xs font-medium transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : `${theme.textMuted} ${theme.hoverRow} hover:text-current`
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge != null && (
                  <span
                    className={`font-mono-code text-[10px] px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-indigo-500/12 text-indigo-500 dark:text-indigo-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`p-3.5 border-t ${theme.border} space-y-3`}>
          <button
            onClick={() => navigate('profile')}
            className={`w-full p-2 rounded-lg flex items-center gap-2.5 text-left ${theme.hoverRow} transition`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: user.accent }}
            >
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              <p className={`text-[11px] truncate ${theme.textMuted}`}>{user.role}</p>
            </div>
          </button>

          <p className={`text-[11px] text-center leading-relaxed ${theme.textMuted}`}>
            Designed &amp; Developed by{' '}
            <a
              href="https://portfolio-new-eta-jet.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline font-medium"
            >
              Jamal Aliyev
            </a>
          </p>
        </div>
      </aside>

      {/* MOBILE SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={`fixed inset-y-0 left-0 w-[82vw] max-w-[310px] z-50 flex flex-col justify-between border-r lg:hidden ${theme.bgSidebar}`}
            >
              <div className="flex flex-col flex-1 overflow-y-auto">
                <div className={`h-16 px-4 flex items-center justify-between border-b ${theme.border}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-bold text-sm">{workspaceName}</span>
                  </div>
                  <button onClick={() => setMobileDrawerOpen(false)} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.id)}
                        className={`w-full min-h-[44px] px-3.5 rounded-lg flex items-center justify-between text-sm font-medium transition ${
                          active ? 'bg-indigo-600 text-white' : `${theme.textMuted} ${theme.hoverRow} hover:text-current`
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </span>
                        {item.badge != null && (
                          <span className="font-mono-code text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className={`p-4 border-t ${theme.border} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${theme.textMuted}`}>Theme Mode</span>
                  <select
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value)}
                    className={`min-h-[38px] px-2 rounded-lg border ${theme.border} bg-transparent text-xs`}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="cyberpunk">Cyberpunk</option>
                  </select>
                </div>
                <p className={`text-[11px] text-center ${theme.textMuted}`}>
                  Designed &amp; Developed by{' '}
                  <a href="https://portfolio-new-eta-jet.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline font-medium">
                    Jamal Aliyev
                  </a>
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Sticky App Header */}
        <header
          className={`sticky top-0 z-20 h-16 px-4 sm:px-6 lg:px-8 border-b backdrop-blur-md flex items-center justify-between gap-2 ${
            isCyber ? 'bg-[#05050A]/85 border-[#00FFCC]/30' : isDark ? 'bg-[#09090B]/85 border-zinc-800/80' : 'bg-[#F8FAFC]/85 border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open Navigation"
              className="lg:hidden min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className={`hidden sm:inline ${theme.textMuted}`}>{workspaceName}</span>
                <ChevronRight className={`hidden sm:inline w-3.5 h-3.5 ${theme.textMuted}`} />
                <span className="font-semibold capitalize text-sm sm:text-xs truncate">
                  {navItems.find((i) => i.id === activePage)?.label || 'Workspace'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => setCommandOpen(true)}
              aria-label="Search Workspace"
              className={`min-w-[40px] min-h-[40px] px-2.5 sm:px-3 rounded-lg border ${theme.border} ${theme.bgCard} flex items-center gap-2 text-xs ${theme.textMuted} hover:border-indigo-500/50 transition`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Search...</span>
            </button>

            {/* Quick Font Size Adjuster in Header */}
            <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border ${theme.border} ${theme.bgCard}`}>
              <span className={`text-[11px] ${theme.textMuted}`}>Font:</span>
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-black/10 dark:hover:bg-white/10"
                title="Decrease Font Size"
              >
                A-
              </button>
              <span className="text-xs font-mono-code px-1">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(22, s + 2))}
                className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-black/10 dark:hover:bg-white/10"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <button
              onClick={() => navigate('notifications')}
              aria-label="Notifications"
              className={`relative min-w-[40px] min-h-[40px] rounded-lg border ${theme.border} ${theme.bgCard} flex items-center justify-center hover:border-indigo-500/50 transition`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() =>
                setTaskModalState({
                  open: true,
                  task: null,
                  defaultStatus: 'Backlog',
                  defaultProjectId: projects[0]?.id || 'proj-1',
                  defaultDate: ''
                })
              }
              className="min-h-[40px] px-3 sm:px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/25 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className={`flex-1 max-w-[1600px] w-full mx-auto ${compactMode ? 'p-3 sm:p-5' : 'p-4 sm:p-6 lg:p-8'}`}>
          {isLoading ? (
            <LoadingSkeleton theme={theme} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {activePage === 'dashboard' && (
                  <DashboardView
                    tasks={tasks}
                    projects={projects}
                    team={team}
                    activity={activity}
                    user={user}
                    navigate={navigate}
                    onOpenNewTask={() =>
                      setTaskModalState({
                        open: true,
                        task: null,
                        defaultStatus: 'Backlog',
                        defaultProjectId: projects[0]?.id || 'proj-1',
                        defaultDate: ''
                      })
                    }
                    onEditTask={(task) =>
                      setTaskModalState({ open: true, task, defaultStatus: task.status, defaultProjectId: task.projectId, defaultDate: '' })
                    }
                    theme={theme}
                  />
                )}

                {activePage === 'tasks' && (
                  <TasksWorkspaceView
                    tasks={tasks}
                    projects={projects}
                    team={team}
                    defaultTaskView={defaultTaskView}
                    onMoveTaskStatus={handleMoveTaskStatus}
                    onEditTask={(task) =>
                      setTaskModalState({ open: true, task, defaultStatus: task.status, defaultProjectId: task.projectId, defaultDate: '' })
                    }
                    onDeleteTask={handleDeleteTask}
                    onOpenNewTask={(status = 'Backlog') =>
                      setTaskModalState({
                        open: true,
                        task: null,
                        defaultStatus: status,
                        defaultProjectId: projects[0]?.id || 'proj-1',
                        defaultDate: ''
                      })
                    }
                    theme={theme}
                    compactMode={compactMode}
                  />
                )}

                {activePage === 'projects' && (
                  <ProjectsView
                    projects={projects}
                    tasks={tasks}
                    team={team}
                    selectedProjectDetailId={selectedProjectDetailId}
                    setSelectedProjectDetailId={setSelectedProjectDetailId}
                    onOpenNewProject={() => setProjectModalState({ open: true, project: null })}
                    onEditProject={(project) => setProjectModalState({ open: true, project })}
                    onDeleteProject={handleDeleteProject}
                    onOpenNewTaskForProject={(projectId) =>
                      setTaskModalState({
                        open: true,
                        task: null,
                        defaultStatus: 'Backlog',
                        defaultProjectId: projectId,
                        defaultDate: ''
                      })
                    }
                    onEditTask={(task) =>
                      setTaskModalState({ open: true, task, defaultStatus: task.status, defaultProjectId: task.projectId, defaultDate: '' })
                    }
                    theme={theme}
                  />
                )}

                {activePage === 'calendar' && (
                  <CalendarView
                    tasks={tasks}
                    events={events}
                    setEvents={setEvents}
                    projects={projects}
                    onEditTask={(task) =>
                      setTaskModalState({ open: true, task, defaultStatus: task.status, defaultProjectId: task.projectId, defaultDate: '' })
                    }
                    onCreateTaskOnDate={(dateStr) =>
                      setTaskModalState({
                        open: true,
                        task: null,
                        defaultStatus: 'Backlog',
                        defaultProjectId: projects[0]?.id || 'proj-1',
                        defaultDate: dateStr
                      })
                    }
                    showToast={showToast}
                    theme={theme}
                  />
                )}

                {activePage === 'team' && (
                  <TeamView
                    team={team}
                    tasks={tasks}
                    projects={projects}
                    onAssignNewTask={(memberId) =>
                      setTaskModalState({
                        open: true,
                        task: null,
                        defaultStatus: 'Backlog',
                        defaultProjectId: projects[0]?.id || 'proj-1',
                        defaultDate: '',
                        defaultAssigneeId: memberId
                      })
                    }
                    onEditTask={(task) =>
                      setTaskModalState({ open: true, task, defaultStatus: task.status, defaultProjectId: task.projectId, defaultDate: '' })
                    }
                    theme={theme}
                  />
                )}

                {activePage === 'analytics' && (
                  <AnalyticsView
                    tasks={tasks}
                    projects={projects}
                    team={team}
                    showToast={showToast}
                    theme={theme}
                  />
                )}

                {activePage === 'games' && (
                  <MiniGamesView showToast={showToast} theme={theme} />
                )}

                {activePage === 'notifications' && (
                  <NotificationsView
                    notifications={notifications}
                    setNotifications={setNotifications}
                    tasks={tasks}
                    onJumpToTask={(taskId) => {
                      const found = tasks.find((t) => t.id === taskId);
                      if (found) {
                        setTaskModalState({ open: true, task: found, defaultStatus: found.status, defaultProjectId: found.projectId, defaultDate: '' });
                      } else {
                        navigate('tasks');
                      }
                    }}
                    showToast={showToast}
                    theme={theme}
                  />
                )}

                {activePage === 'settings' && (
                  <SettingsView
                    workspaceName={workspaceName}
                    setWorkspaceName={setWorkspaceName}
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    lineSpacing={lineSpacing}
                    setLineSpacing={setLineSpacing}
                    compactMode={compactMode}
                    setCompactMode={setCompactMode}
                    defaultTaskView={defaultTaskView}
                    setDefaultTaskView={setDefaultTaskView}
                    notifPrefs={notifPrefs}
                    setNotifPrefs={setNotifPrefs}
                    onResetDemoData={handleResetDemoData}
                    showToast={showToast}
                    theme={theme}
                  />
                )}

                {activePage === 'profile' && (
                  <ProfileView
                    user={user}
                    setUser={setUser}
                    tasks={tasks}
                    projects={projects}
                    showToast={showToast}
                    theme={theme}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Footer */}
        <footer className={`px-4 sm:px-8 py-4 border-t ${theme.border} flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${theme.textMuted}`}>
          <span>{workspaceName} &bull; Real-time LocalStorage Sync Active</span>
          <span>
            Designed &amp; Developed by{' '}
            <a href="https://portfolio-new-eta-jet.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline font-medium">
              Jamal Aliyev
            </a>
          </span>
        </footer>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Fully responsive touch optimization) */}
      <nav className={`fixed bottom-0 inset-x-0 z-40 lg:hidden border-t ${theme.bgSidebar} px-2 py-2 flex items-center justify-around`}>
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare },
          { id: 'projects', label: 'Projects', icon: FolderKanban },
          { id: 'games', label: 'Games', icon: Play },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition ${
                active ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : `${theme.textMuted}`
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Modals & Dialogs */}
      <TaskFormModal
        state={taskModalState}
        onClose={() => setTaskModalState({ open: false, task: null, defaultStatus: 'Backlog', defaultProjectId: 'proj-1', defaultDate: '' })}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        projects={projects}
        team={team}
        currentUserId={user.id}
        theme={theme}
      />

      <ProjectFormModal
        state={projectModalState}
        onClose={() => setProjectModalState({ open: false, project: null })}
        onSave={handleSaveProject}
        team={team}
        currentUserId={user.id}
        theme={theme}
      />

      <CommandPaletteModal
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        tasks={tasks}
        projects={projects}
        team={team}
        navigate={navigate}
        onSelectTask={(task) => {
          setCommandOpen(false);
          setTaskModalState({ open: true, task, defaultStatus: task.status, defaultProjectId: task.projectId, defaultDate: '' });
        }}
        onCreateTask={() => {
          setCommandOpen(false);
          setTaskModalState({ open: true, task: null, defaultStatus: 'Backlog', defaultProjectId: projects[0]?.id || 'proj-1', defaultDate: '' });
        }}
        theme={theme}
      />

      <AnimatePresence>
        {confirmDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md p-6 rounded-xl border shadow-2xl ${theme.bgCard}`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{confirmDialog.title}</h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${theme.textMuted}`}>{confirmDialog.message}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  onClick={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })}
                  className={`min-h-[40px] px-4 rounded-lg border ${theme.border} font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="min-h-[40px] px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-16 sm:bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="pointer-events-auto sm:min-w-[290px] max-w-md px-4 py-3 rounded-xl bg-zinc-900 text-white border border-zinc-700/80 shadow-xl flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// LOADING SKELETON & LANDING PAGE VIEW
// ============================================================================

function LoadingSkeleton({ theme }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className={`h-8 w-56 rounded-lg ${theme.bgSubtle}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-28 rounded-xl border ${theme.bgCard}`} />
        ))}
      </div>
      <div className={`h-72 rounded-xl border ${theme.bgCard}`} />
    </div>
  );
}

function LandingPageView({ themeMode, setThemeMode, onLaunchApp, tasksCount, projectsCount, theme }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className={`h-16 px-4 sm:px-8 border-b ${theme.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-base tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className={`min-h-[38px] px-3 rounded-lg border ${theme.border} text-xs font-medium`}
          >
            {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={() => onLaunchApp('dashboard')}
            className="min-h-[38px] px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Open Workspace
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/12 text-indigo-500 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Project &amp; Sprint Architecture
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
          Ship faster with clarity, speed, and zero friction.
        </h1>
        <p className={`text-sm sm:text-base max-w-2xl mx-auto ${theme.textMuted}`}>
          Manage {projectsCount} active projects and {tasksCount} tasks across Kanban boards, calendar schedules, and real-time analytics—persisted locally with sub-50ms responsiveness.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onLaunchApp('dashboard')}
            className="min-h-[46px] px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            Launch Dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLaunchApp('tasks')}
            className={`min-h-[46px] px-6 rounded-xl border ${theme.border} ${theme.bgCard} text-xs font-semibold`}
          >
            Explore Kanban Board
          </button>
        </div>
      </main>

      <footer className={`px-4 sm:px-8 py-5 border-t ${theme.border} text-center text-xs ${theme.textMuted}`}>
        Designed &amp; Developed by{' '}
        <a href="https://portfolio-new-eta-jet.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline font-medium">
          Jamal Aliyev
        </a>
      </footer>
    </div>
  );
}

// ============================================================================
// DASHBOARD & TASKS WORKSPACE VIEWS
// ============================================================================

function DashboardView({ tasks, projects, team, activity, user, navigate, onOpenNewTask, onEditTask, theme }) {
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Done');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>Here is your real-time workspace overview across {projects.length} active projects.</p>
        </div>
        <button
          onClick={onOpenNewTask}
          className="min-h-[40px] px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, sub: 'Across all sprints', icon: CheckSquare, color: 'text-indigo-500' },
          { label: 'Completed', value: completedTasks, sub: `${Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% completion rate`, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'In Progress', value: inProgressTasks, sub: 'Active engineering work', icon: Clock, color: 'text-sky-500' },
          { label: 'Urgent Priority', value: urgentTasks.length, sub: 'Requires immediate focus', icon: AlertCircle, color: 'text-rose-500' }
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`p-5 rounded-xl border ${theme.bgCard} flex items-start justify-between`}>
              <div>
                <p className={`text-xs font-medium ${theme.textMuted}`}>{kpi.label}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1.5">{kpi.value}</p>
                <p className={`text-[11px] mt-1 ${theme.textMuted}`}>{kpi.sub}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${theme.bgSubtle} ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority & Upcoming Tasks */}
        <div className={`lg:col-span-7 p-5 rounded-xl border ${theme.bgCard} space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Priority Queue</h2>
            <button onClick={() => navigate('tasks')} className="text-xs text-indigo-500 font-semibold hover:underline">
              View All Tasks &rarr;
            </button>
          </div>
          <div className="space-y-2.5">
            {tasks
              .filter((t) => t.status !== 'Done')
              .slice(0, 5)
              .map((t) => {
                const assignee = team.find((m) => m.id === t.assigneeId);
                return (
                  <div
                    key={t.id}
                    onClick={() => onEditTask(t)}
                    className={`p-3.5 rounded-xl border ${theme.border} ${theme.hoverRow} cursor-pointer flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[t.status]}`} />
                      <span className="font-mono-code text-xs text-indigo-500 font-semibold">{t.id}</span>
                      <span className="text-xs font-medium truncate">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[t.priority]}`}>
                        {t.priority}
                      </span>
                      {assignee && (
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: assignee.color }}
                          title={assignee.name}
                        >
                          {assignee.initials}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className={`lg:col-span-5 p-5 rounded-xl border ${theme.bgCard} space-y-4`}>
          <h2 className="text-base font-bold">Recent Activity</h2>
          <div className="space-y-3">
            {activity.slice(0, 6).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-current/10 last:border-0">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p>
                    <strong>{act.actor}</strong> {act.action} <span className="text-indigo-500 font-medium">{act.target}</span>
                  </p>
                  <span className={`text-[11px] ${theme.textMuted}`}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksWorkspaceView({
  tasks,
  projects,
  team,
  defaultTaskView,
  onMoveTaskStatus,
  onEditTask,
  onDeleteTask,
  onOpenNewTask,
  theme
}) {
  const [viewMode, setViewMode] = useState(defaultTaskView || 'board');
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesProject = filterProject === 'all' || t.projectId === filterProject;
      const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
      const q = search.trim().toLowerCase();
      const matchesQuery = !q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
      return matchesProject && matchesPriority && matchesQuery;
    });
  }, [tasks, filterProject, filterPriority, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>Drag and drop cards across columns or switch to structured table view.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`inline-flex p-1 rounded-lg border ${theme.border} ${theme.bgCard}`}>
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
                viewMode === 'board' ? 'bg-indigo-600 text-white' : theme.textMuted
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : theme.textMuted
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <button
            onClick={() => onOpenNewTask('Backlog')}
            className="min-h-[38px] px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex items-center px-3 min-h-[40px] rounded-lg border ${theme.border} ${theme.bgCard} flex-1`}>
          <Search className={`w-4 h-4 mr-2 ${theme.textMuted}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or ID..."
            className="w-full bg-transparent text-xs focus:outline-none"
          />
        </div>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className={`min-h-[40px] px-3 rounded-lg border ${theme.border} ${theme.bgCard} text-xs`}
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className={`min-h-[40px] px-3 rounded-lg border ${theme.border} ${theme.bgCard} text-xs`}
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUSES.map((status) => {
            const colTasks = filteredTasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedTaskId) {
                    onMoveTaskStatus(draggedTaskId, status);
                    setDraggedTaskId(null);
                  }
                }}
                className={`p-3.5 rounded-xl border ${theme.border} ${theme.bgSubtle} flex flex-col gap-3 min-h-[380px]`}
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">{status}</h3>
                    <span className={`font-mono-code text-xs ${theme.textMuted}`}>({colTasks.length})</span>
                  </div>
                  <button
                    onClick={() => onOpenNewTask(status)}
                    className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${theme.textMuted}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colTasks.map((task) => {
                    const proj = projects.find((p) => p.id === task.projectId);
                    const assignee = team.find((m) => m.id === task.assigneeId);
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                        onClick={() => onEditTask(task)}
                        className={`p-3.5 rounded-xl border ${theme.bgCard} hover:border-indigo-500/60 cursor-pointer space-y-2.5 shadow-xs transition`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-code text-[11px] font-semibold text-indigo-500">{task.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs font-semibold leading-snug">{task.title}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-current/10">
                          <span className={`text-[10px] font-medium truncate ${theme.textMuted}`}>{proj?.key || 'TASK'}</span>
                          <div className="flex items-center gap-2">
                            {task.dueDate && <span className={`text-[10px] font-mono-code ${theme.textMuted}`}>{task.dueDate.slice(5)}</span>}
                            {assignee && (
                              <span
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                                style={{ backgroundColor: assignee.color }}
                              >
                                {assignee.initials}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`rounded-xl border ${theme.bgCard} overflow-x-auto`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${theme.border} ${theme.textMuted}`}>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id} onClick={() => onEditTask(t)} className={`border-b ${theme.border} ${theme.hoverRow} cursor-pointer`}>
                  <td className="py-3 px-4 font-mono-code text-indigo-500 font-semibold">{t.id}</td>
                  <td className="py-3 px-4 font-medium">{t.title}</td>
                  <td className="py-3 px-4">{t.status}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="py-3 px-4 font-mono-code">{t.dueDate || '—'}</td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onDeleteTask(t.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MINI GAMES VIEW (Memory Card Game & Tic-Tac-Toe Suite)
// ============================================================================

function MiniGamesView({ showToast, theme }) {
  const [activeGame, setActiveGame] = useState('memory'); // memory | tictactoe

  // Memory Card Game State
  const cardSymbols = ['🚀', '⚡', '💎', '🔥', '💻', '🎨', '⚙️', '🌟'];
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isMemoryWon, setIsMemoryWon] = useState(false);

  const initMemoryGame = () => {
    const deck = [...cardSymbols, ...cardSymbols]
      .sort(() => Math.random() - 0.5)
      .map((sym, idx) => ({ id: idx, symbol: sym }));
    setMemoryCards(deck);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsMemoryWon(false);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  const handleCardClick = (idx) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(idx) || matchedPairs.includes(memoryCards[idx].symbol)) return;
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (memoryCards[firstIdx].symbol === memoryCards[secondIdx].symbol) {
        const updatedMatches = [...matchedPairs, memoryCards[firstIdx].symbol];
        setMatchedPairs(updatedMatches);
        setFlippedIndices([]);
        if (updatedMatches.length === cardSymbols.length) {
          setIsMemoryWon(true);
          showToast('Congratulations! Memory game completed in ' + (moves + 1) + ' moves!');
        }
      } else {
        setTimeout(() => setFlippedIndices([]), 850);
      }
    }
  };

  // Tic-Tac-Toe State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isBoardFull = board.every((cell) => cell !== null);

  const handleTicTacToeClick = (i) => {
    if (board[i] || winner) return;
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  const resetTicTacToe = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Interactive Mini-Game Suite</h1>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>Take a quick break with built-in productivity games.</p>
        </div>
        <div className={`inline-flex p-1 rounded-xl border ${theme.border} ${theme.bgCard}`}>
          <button
            onClick={() => setActiveGame('memory')}
            className={`min-h-[38px] px-4 rounded-lg text-xs font-semibold transition ${
              activeGame === 'memory' ? 'bg-indigo-600 text-white' : theme.textMuted
            }`}
          >
            Memory Match
          </button>
          <button
            onClick={() => setActiveGame('tictactoe')}
            className={`min-h-[38px] px-4 rounded-lg text-xs font-semibold transition ${
              activeGame === 'tictactoe' ? 'bg-indigo-600 text-white' : theme.textMuted
            }`}
          >
            Tic-Tac-Toe
          </button>
        </div>
      </div>

      {activeGame === 'memory' ? (
        <div className={`p-6 rounded-2xl border ${theme.bgCard} text-center space-y-6`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Moves: {moves}</span>
            <span className="text-xs font-semibold">Matched: {matchedPairs.length} / {cardSymbols.length}</span>
            <button
              onClick={initMemoryGame}
              className="min-h-[36px] px-3.5 rounded-lg border border-indigo-500/50 text-indigo-500 font-semibold hover:bg-indigo-500/10 transition"
            >
              Restart
            </button>
          </div>

          {isMemoryWon && (
            <div className="p-4 rounded-xl bg-emerald-500/15 text-emerald-500 font-bold">
              🎉 You won the Memory Game in {moves} moves!
            </div>
          )}

          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {memoryCards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.symbol);
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-xl border flex items-center justify-center text-3xl transition-all duration-300 ${
                    isFlipped
                      ? 'bg-indigo-600/20 border-indigo-500 scale-100'
                      : `${theme.bgSubtle} ${theme.border} hover:border-indigo-500/50`
                  }`}
                >
                  {isFlipped ? card.symbol : '❓'}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={`p-6 rounded-2xl border ${theme.bgCard} text-center space-y-6 max-w-md mx-auto`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">
              {winner ? `Winner: ${winner}` : isBoardFull ? "It's a Draw!" : `Next Player: ${xIsNext ? 'X' : 'O'}`}
            </span>
            <button
              onClick={resetTicTacToe}
              className="min-h-[36px] px-3.5 rounded-lg border border-indigo-500/50 text-indigo-500 font-semibold hover:bg-indigo-500/10 transition"
            >
              Reset Game
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 aspect-square">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleTicTacToeClick(i)}
                className={`rounded-xl border text-4xl font-bold flex items-center justify-center transition ${
                  cell === 'X' ? 'text-indigo-500' : 'text-emerald-500'
                } ${theme.bgSubtle} ${theme.border} hover:border-indigo-500/50`}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 8. VIEW 4: PROJECTS MANAGEMENT VIEW
// ============================================================================

function ProjectsView({
  projects,
  tasks,
  team,
  selectedProjectDetailId,
  setSelectedProjectDetailId,
  onOpenNewProject,
  onEditProject,
  onDeleteProject,
  onOpenNewTaskForProject,
  onEditTask,
  theme
}) {
  const activeProject = projects.find((p) => p.id === selectedProjectDetailId);

  if (activeProject) {
    const projectTasks = tasks.filter((t) => t.projectId === activeProject.id);
    const doneCount = projectTasks.filter((t) => t.status === 'Done').length;
    const progress = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedProjectDetailId(null)}
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${theme.textMuted} hover:text-indigo-500`}
        >
          <ChevronLeft className="w-4 h-4" /> Back to All Projects
        </button>

        <div className={`p-6 rounded-xl border ${theme.bgCard} flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span
                className="font-mono-code text-xs px-2 py-0.5 rounded text-white font-bold"
                style={{ backgroundColor: activeProject.color }}
              >
                {activeProject.key}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/12 text-emerald-500 font-medium">
                {activeProject.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{activeProject.name}</h1>
            <p className={`text-xs sm:text-sm max-w-2xl ${theme.textMuted}`}>{activeProject.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onEditProject(activeProject)}
              className={`min-h-[40px] px-4 rounded-lg border ${theme.border} text-xs font-medium`}
            >
              Edit Project
            </button>
            <button
              onClick={() => onOpenNewTaskForProject(activeProject.id)}
              className="min-h-[40px] px-4 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Project Progress & Task List */}
        <div className={`p-5 rounded-xl border ${theme.bgCard}`}>
          <div className="flex justify-between text-xs mb-2">
            <span className="font-semibold">Milestone Completion ({doneCount}/{projectTasks.length} Tasks)</span>
            <span className="font-mono-code font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden mb-6">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: activeProject.color }} />
          </div>

          {projectTasks.length === 0 ? (
            <p className={`text-xs text-center py-8 ${theme.textMuted}`}>No tasks assigned to this project yet.</p>
          ) : (
            <div className="space-y-2.5">
              {projectTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onEditTask(t)}
                  className={`p-3.5 rounded-lg border ${theme.border} ${theme.hoverRow} cursor-pointer flex items-center justify-between gap-3`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[t.status]}`} />
                    <span className="font-mono-code text-xs text-indigo-500">{t.id}</span>
                    <span className="text-xs font-medium truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[t.priority]}`}>
                      {t.priority}
                    </span>
                    <span className={`text-xs hidden sm:inline ${theme.textMuted}`}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>
            Manage active initiatives, monitor completion ratios, and inspect sprint backlogs.
          </p>
        </div>
        <button
          onClick={onOpenNewProject}
          className="min-h-[42px] px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FolderPlus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const done = projTasks.filter((t) => t.status === 'Done').length;
          const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

          return (
            <div
              key={proj.id}
              className={`p-5 sm:p-6 rounded-xl border ${theme.bgCard} hover:border-indigo-500/60 transition flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="font-mono-code text-xs px-2 py-0.5 rounded text-white font-bold"
                      style={{ backgroundColor: proj.color }}
                    >
                      {proj.key}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${theme.bgSubtle} font-medium`}>
                      {proj.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProject(proj)}
                      aria-label="Edit Project"
                      className={`p-2 rounded-lg ${theme.hoverRow}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      aria-label="Delete Project"
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3
                  onClick={() => setSelectedProjectDetailId(proj.id)}
                  className="text-lg font-bold mt-3 cursor-pointer hover:text-indigo-500 transition"
                >
                  {proj.name}
                </h3>
                <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${theme.textMuted}`}>
                  {proj.description}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={theme.textMuted}>
                      Progress ({done}/{projTasks.length} tasks)
                    </span>
                    <span className="font-mono-code font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: proj.color }}
                    />
                  </div>
                </div>

                <div className={`pt-3.5 border-t ${theme.border} flex items-center justify-between`}>
                  <div className="flex -space-x-2">
                    {(proj.memberIds || []).slice(0, 4).map((mid) => {
                      const m = team.find((u) => u.id === mid);
                      if (!m) return null;
                      return (
                        <div
                          key={mid}
                          title={m.name}
                          className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: m.color }}
                        >
                          {m.initials}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono-code ${theme.textMuted}`}>Due {proj.deadline}</span>
                    <button
                      onClick={() => setSelectedProjectDetailId(proj.id)}
                      className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
                    >
                      Open <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 9. VIEW 5: CALENDAR (MONTH & WEEK VIEW + EVENT CREATOR)
// ============================================================================

function CalendarView({ tasks, events, setEvents, projects, onEditTask, onCreateTaskOnDate, showToast, theme }) {
  const [calMode, setCalMode] = useState('month'); // month | week
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(getRelativeDate(0));
  const [newEventTime, setNewEventTime] = useState('14:00');
  const [newEventType, setNewEventType] = useState('meeting');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, iso, dateObj });
    }
    return cells;
  }, [year, month]);

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return {
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        iso
      };
    });
  }, [currentDate]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    setEvents((prev) => [
      ...prev,
      {
        id: `evt-${Date.now()}`,
        title: newEventTitle.trim(),
        date: newEventDate,
        time: newEventTime,
        type: newEventType,
        projectId: projects[0]?.id || 'proj-1'
      }
    ]);
    showToast(`Event "${newEventTitle.trim()}" scheduled`);
    setNewEventTitle('');
    setEventModalOpen(false);
  };

  const todayIso = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{monthLabel}</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setCurrentDate(new Date(year, month - (calMode === 'month' ? 1 : 0), currentDate.getDate() - (calMode === 'week' ? 7 : 0)))
              }
              aria-label="Previous"
              className={`p-2 rounded-lg border ${theme.border} ${theme.bgCard}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className={`px-3 py-1.5 rounded-lg border ${theme.border} ${theme.bgCard} text-xs font-medium`}
            >
              Today
            </button>
            <button
              onClick={() =>
                setCurrentDate(new Date(year, month + (calMode === 'month' ? 1 : 0), currentDate.getDate() + (calMode === 'week' ? 7 : 0)))
              }
              aria-label="Next"
              className={`p-2 rounded-lg border ${theme.border} ${theme.bgCard}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`inline-flex p-1 rounded-lg border ${theme.border} ${theme.bgCard}`}>
            <button
              onClick={() => setCalMode('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                calMode === 'month' ? 'bg-indigo-600 text-white' : theme.textMuted
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCalMode('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                calMode === 'week' ? 'bg-indigo-600 text-white' : theme.textMuted
              }`}
            >
              Week
            </button>
          </div>

          <button
            onClick={() => setEventModalOpen(true)}
            className="min-h-[40px] px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {calMode === 'month' ? (
        <div className={`rounded-xl border ${theme.bgCard} overflow-hidden`}>
          <div className={`grid grid-cols-7 border-b ${theme.border} text-center py-2.5 text-[11px] font-semibold uppercase ${theme.textMuted}`}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-[minmax(88px,auto)] sm:auto-rows-[minmax(115px,auto)]">
            {daysInMonth.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className={`border-b border-r ${theme.border} opacity-40`} />;
              }
              const dayTasks = tasks.filter((t) => t.dueDate === cell.iso);
              const dayEvents = events.filter((e) => e.date === cell.iso);
              const isToday = cell.iso === todayIso;

              return (
                <div
                  key={cell.iso}
                  onClick={() => {
                    setNewEventDate(cell.iso);
                    setEventModalOpen(true);
                  }}
                  className={`p-1.5 sm:p-2 border-b border-r ${theme.border} ${theme.hoverRow} cursor-pointer transition flex flex-col gap-1 overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isToday ? 'bg-indigo-600 text-white font-bold' : ''
                      }`}
                    >
                      {cell.day}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-20">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => e.stopPropagation()}
                        className="px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-500 dark:text-violet-300 text-[10px] font-medium truncate"
                      >
                        {ev.time} {ev.title}
                      </div>
                    ))}
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(t);
                        }}
                        className="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 text-[10px] font-medium truncate hover:underline"
                      >
                        {t.id}: {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* WEEK VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weekDays.map((wd) => {
            const dayTasks = tasks.filter((t) => t.dueDate === wd.iso);
            const dayEvents = events.filter((e) => e.date === wd.iso);
            const isToday = wd.iso === todayIso;

            return (
              <div
                key={wd.iso}
                className={`p-3.5 rounded-xl border min-h-[220px] flex flex-col justify-between ${
                  isToday ? 'border-indigo-500 ring-1 ring-indigo-500/30' : theme.border
                } ${theme.bgCard}`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-current/10">
                    <span className={`text-xs font-medium ${theme.textMuted}`}>{wd.dayName}</span>
                    <span className={`text-sm font-bold ${isToday ? 'text-indigo-500' : ''}`}>{wd.dayNum}</span>
                  </div>

                  <div className="space-y-2">
                    {dayEvents.map((ev) => (
                      <div key={ev.id} className="p-2 rounded-lg bg-violet-500/12 border border-violet-500/25 text-xs">
                        <span className="font-mono-code text-[10px] text-violet-400 block">{ev.time}</span>
                        <p className="font-medium mt-0.5">{ev.title}</p>
                      </div>
                    ))}
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onEditTask(t)}
                        className={`p-2 rounded-lg border ${theme.border} ${theme.hoverRow} cursor-pointer text-xs`}
                      >
                        <span className="font-mono-code text-[10px] text-indigo-500">{t.id}</span>
                        <p className="font-medium mt-0.5 line-clamp-2">{t.title}</p>
                      </div>
                    ))}
                    {dayEvents.length === 0 && dayTasks.length === 0 && (
                      <p className={`text-[11px] text-center py-6 ${theme.textMuted}`}>Open schedule</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onCreateTaskOnDate(wd.iso)}
                  className={`mt-3 w-full py-1.5 rounded-lg border border-dashed ${theme.border} text-[11px] ${theme.textMuted} hover:border-indigo-500 hover:text-indigo-500 transition`}
                >
                  + Schedule Task
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Calendar Event Modal */}
      <AnimatePresence>
        {eventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-md p-6 rounded-xl border shadow-2xl ${theme.bgCard}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">Schedule Calendar Event</h3>
                <button onClick={() => setEventModalOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Event Title</label>
                  <input
                    required
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Architecture Sync / Release Review"
                    className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} bg-transparent`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">Date</label>
                    <input
                      required
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} bg-transparent`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Time</label>
                    <input
                      required
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} bg-transparent`}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEventModalOpen(false)}
                    className={`min-h-[40px] px-4 rounded-lg border ${theme.border}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] px-4 rounded-lg bg-indigo-600 text-white font-semibold"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// 10. VIEW 6: TEAM DIRECTORY & WORKLOAD
// ============================================================================

function TeamView({ team, tasks, projects, onAssignNewTask, onEditTask, theme }) {
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const inspectedMember = team.find((m) => m.id === selectedMemberId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team &amp; Capacity</h1>
        <p className={`text-xs mt-1 ${theme.textMuted}`}>
          Inspect active engineering and design workloads, role assignments, and sprint bandwidth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {team.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          const activeTasks = memberTasks.filter((t) => t.status !== 'Done');
          const assignedHours = activeTasks.reduce((sum, t) => sum + (t.estimateHours || 4), 0);
          const utilization = Math.min(100, Math.round((assignedHours / member.capacityHours) * 100));

          return (
            <div key={member.id} className={`p-5 rounded-xl border ${theme.bgCard} flex flex-col justify-between`}>
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{member.name}</h3>
                      <p className="text-xs text-indigo-500 font-medium">{member.role}</p>
                      <p className={`text-[11px] ${theme.textMuted}`}>
                        {member.department} &bull; {member.location}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/12 text-emerald-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {member.status}
                  </span>
                </div>

                {/* Capacity Bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={theme.textMuted}>Sprint Bandwidth ({assignedHours}h / {member.capacityHours}h)</span>
                    <span className="font-mono-code font-semibold">{utilization}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        utilization > 85 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs">
                  <span>
                    <strong>{activeTasks.length}</strong> <span className={theme.textMuted}>Active</span>
                  </span>
                  <span>
                    <strong>{memberTasks.length - activeTasks.length}</strong>{' '}
                    <span className={theme.textMuted}>Completed</span>
                  </span>
                </div>
              </div>

              <div className={`mt-5 pt-3.5 border-t ${theme.border} flex items-center gap-2`}>
                <button
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`flex-1 min-h-[38px] rounded-lg border ${theme.border} text-xs font-medium hover:border-indigo-500 transition`}
                >
                  View Profile
                </button>
                <button
                  onClick={() => onAssignNewTask(member.id)}
                  className="flex-1 min-h-[38px] rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                >
                  Assign Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Inspection Modal */}
      <AnimatePresence>
        {inspectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-lg p-6 rounded-xl border shadow-2xl ${theme.bgCard} max-h-[85vh] overflow-y-auto`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold"
                    style={{ backgroundColor: inspectedMember.color }}
                  >
                    {inspectedMember.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{inspectedMember.name}</h3>
                    <p className="text-xs text-indigo-500 font-medium">{inspectedMember.role}</p>
                    <p className={`text-xs ${theme.textMuted}`}>{inspectedMember.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMemberId(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">Assigned Tasks</h4>
                <div className="space-y-2">
                  {tasks
                    .filter((t) => t.assigneeId === inspectedMember.id)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedMemberId(null);
                          onEditTask(t);
                        }}
                        className={`p-3 rounded-lg border ${theme.border} ${theme.hoverRow} cursor-pointer flex items-center justify-between text-xs`}
                      >
                        <span className="truncate font-medium">
                          <span className="font-mono-code text-indigo-500 mr-2">{t.id}</span>
                          {t.title}
                        </span>
                        <span className={`text-[11px] ml-2 flex-shrink-0 ${theme.textMuted}`}>{t.status}</span>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// 11. VIEW 7: ANALYTICS & REPORTING (CUSTOM SVG CHARTS + CSV EXPORT)
// ============================================================================

function AnalyticsView({ tasks, projects, team, showToast, theme }) {
  const priorityCounts = useMemo(() => {
    return PRIORITIES.map((p) => ({
      priority: p,
      count: tasks.filter((t) => t.priority === p).length
    }));
  }, [tasks]);

  const handleExportCsv = () => {
    const headers = ['Task ID', 'Title', 'Status', 'Priority', 'Due Date', 'Project', 'Assignee'];
    const rows = tasks.map((t) => {
      const proj = projects.find((p) => p.id === t.projectId)?.name || '';
      const user = team.find((m) => m.id === t.assigneeId)?.name || '';
      return [t.id, `"${t.title.replace(/"/g, '""')}"`, t.status, t.priority, t.dueDate || '', `"${proj}"`, `"${user}"`].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taskflow-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Workspace CSV report exported');
  };

  const total = Math.max(tasks.length, 1);
  const donePct = Math.round((tasks.filter((t) => t.status === 'Done').length / total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics &amp; Telemetry</h1>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>
            Real-time sprint throughput, priority distribution, and team workload metrics.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="min-h-[42px] px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Donut Completion Ring */}
        <div className={`lg:col-span-5 p-6 rounded-xl border ${theme.bgCard} flex flex-col items-center justify-center text-center`}>
          <h2 className="text-base font-semibold self-start mb-4">Overall Completion Ratio</h2>
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(donePct / 100) * 314} 314`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{donePct}%</span>
              <span className={`text-[11px] ${theme.textMuted}`}>Completed</span>
            </div>
          </div>
          <p className={`text-xs mt-4 ${theme.textMuted}`}>
            {tasks.filter((t) => t.status === 'Done').length} of {tasks.length} total tasks resolved
          </p>
        </div>

        {/* Priority Distribution Breakdown */}
        <div className={`lg:col-span-7 p-6 rounded-xl border ${theme.bgCard}`}>
          <h2 className="text-base font-semibold mb-5">Priority Distribution</h2>
          <div className="space-y-4">
            {priorityCounts.map((item) => {
              const pct = Math.round((item.count / total) * 100);
              const barColor =
                item.priority === 'Urgent'
                  ? 'bg-rose-500'
                  : item.priority === 'High'
                  ? 'bg-amber-500'
                  : item.priority === 'Medium'
                  ? 'bg-sky-500'
                  : 'bg-slate-400';

              return (
                <div key={item.priority} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{item.priority}</span>
                    <span className="font-mono-code">
                      {item.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Output Comparison */}
      <div className={`p-6 rounded-xl border ${theme.bgCard}`}>
        <h2 className="text-base font-semibold mb-5">Team Task Allocation &amp; Completion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {team.map((m) => {
            const mTasks = tasks.filter((t) => t.assigneeId === m.id);
            const mDone = mTasks.filter((t) => t.status === 'Done').length;
            return (
              <div key={m.id} className={`p-4 rounded-xl border ${theme.border} ${theme.bgSubtle}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{m.name}</p>
                    <p className={`text-[10px] truncate ${theme.textMuted}`}>{m.role}</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-current/10">
                  <span className={theme.textMuted}>Total: {mTasks.length}</span>
                  <span className="text-emerald-500 font-semibold">Done: {mDone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. VIEW 8: NOTIFICATIONS INBOX
// ============================================================================

function NotificationsView({ notifications, setNotifications, onJumpToTask, showToast, theme }) {
  const [filter, setFilter] = useState('all'); // all | unread | mention | deadline

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'unread') return n.unread;
      if (filter === 'mention') return n.type === 'mention';
      if (filter === 'deadline') return n.type === 'deadline';
      return true;
    });
  }, [notifications, filter]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>Stay updated on task mentions, sprint milestones, and deadlines.</p>
        </div>
        <button
          onClick={markAllRead}
          className={`min-h-[40px] px-4 rounded-lg border ${theme.border} ${theme.bgCard} text-xs font-medium hover:border-indigo-500 transition self-start sm:self-auto`}
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'mention', label: 'Mentions' },
          { id: 'deadline', label: 'Deadlines' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`min-h-[36px] px-3.5 rounded-lg text-xs font-medium border transition ${
              filter === tab.id ? 'bg-indigo-600 text-white border-indigo-600' : `${theme.border} ${theme.bgCard}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={`p-12 rounded-xl border ${theme.bgCard} text-center`}>
          <Bell className="w-9 h-9 mx-auto mb-2.5 opacity-30" />
          <p className="text-sm font-semibold">You&apos;re all caught up</p>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>No notifications match this filter.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item)));
                if (n.taskId) onJumpToTask(n.taskId);
              }}
              className={`p-4 rounded-xl border ${
                n.unread ? 'border-indigo-500/50 bg-indigo-500/[0.04]' : theme.border
              } ${theme.bgCard} cursor-pointer hover:border-indigo-500 transition flex items-start justify-between gap-4`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-indigo-500' : 'bg-transparent'}`} />
                <div>
                  <p className="text-xs font-semibold">{n.title}</p>
                  <p className={`text-xs mt-1 ${theme.textMuted}`}>{n.body}</p>
                  <span className={`text-[11px] mt-1.5 block ${theme.textMuted}`}>{n.time}</span>
                </div>
              </div>
              {n.taskId && (
                <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-indigo-500/12 text-indigo-500 flex-shrink-0">
                  {n.taskId}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 13. VIEW 9: WORKSPACE SETTINGS
// ============================================================================

function SettingsView({
  workspaceName,
  setWorkspaceName,
  themeMode,
  setThemeMode,
  fontSize,
  setFontSize,
  lineSpacing,
  setLineSpacing,
  compactMode,
  setCompactMode,
  defaultTaskView,
  setDefaultTaskView,
  notifPrefs,
  setNotifPrefs,
  onResetDemoData,
  showToast,
  theme
}) {
  const [nameInput, setNameInput] = useState(workspaceName);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setWorkspaceName(nameInput.trim());
    showToast('Workspace settings saved');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workspace Settings</h1>
        <p className={`text-xs mt-1 ${theme.textMuted}`}>Configure appearance, accessibility typography, and local persistence.</p>
      </div>

      <form onSubmit={handleSaveGeneral} className={`p-6 rounded-xl border ${theme.bgCard} space-y-5 text-xs`}>
        <h2 className="text-base font-semibold">General, Theme &amp; Accessibility</h2>

        <div>
          <label className="block font-medium mb-1.5">Workspace Name</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className={`w-full max-w-md min-h-[42px] px-3.5 rounded-lg border ${theme.border} bg-transparent`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
            <div>
              <p className="font-semibold">Color Theme</p>
              <p className={`capitalize ${theme.textMuted}`}>{themeMode} Mode</p>
            </div>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${theme.border} ${theme.bgCard} font-medium`}
            >
              <option value="dark">Obsidian Dark</option>
              <option value="light">Crisp Light</option>
              <option value="cyberpunk">Cyberpunk Neon</option>
            </select>
          </div>

          <div className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
            <div>
              <p className="font-semibold">Compact Density</p>
              <p className={theme.textMuted}>{compactMode ? 'Enabled' : 'Comfortable'}</p>
            </div>
            <button
              type="button"
              onClick={() => setCompactMode(!compactMode)}
              className={`px-3.5 py-2 rounded-lg border ${theme.border} font-medium`}
            >
              {compactMode ? 'Disable' : 'Enable'}
            </button>
          </div>

          <div className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
            <div>
              <p className="font-semibold">Base Font Size</p>
              <p className={theme.textMuted}>{fontSize}px</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                className={`px-2.5 py-1.5 rounded-lg border ${theme.border} font-bold`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.min(22, s + 2))}
                className={`px-2.5 py-1.5 rounded-lg border ${theme.border} font-bold`}
              >
                A+
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
            <div>
              <p className="font-semibold">Line Spacing</p>
              <p className={`capitalize ${theme.textMuted}`}>{lineSpacing}</p>
            </div>
            <select
              value={lineSpacing}
              onChange={(e) => setLineSpacing(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${theme.border} ${theme.bgCard} font-medium`}
            >
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
              <option value="loose">Loose</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1.5">Default Task Layout</label>
          <select
            value={defaultTaskView}
            onChange={(e) => setDefaultTaskView(e.target.value)}
            className={`min-h-[42px] px-3.5 rounded-lg border ${theme.border} ${theme.bgCard}`}
          >
            <option value="board">Kanban Board</option>
            <option value="list">Structured Table List</option>
          </select>
        </div>

        <button
          type="submit"
          className="min-h-[42px] px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
        >
          Save Preferences
        </button>
      </form>

      {/* Notification Toggles */}
      <div className={`p-6 rounded-xl border ${theme.bgCard} space-y-4 text-xs`}>
        <h2 className="text-base font-semibold">Alert Preferences</h2>
        {[
          { key: 'mentions', label: 'Direct @mentions in task discussions' },
          { key: 'deadlines', label: '24-hour upcoming deadline reminders' },
          { key: 'statusChanges', label: 'Task completion & milestone updates' }
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between py-1.5 cursor-pointer">
            <span>{item.label}</span>
            <input
              type="checkbox"
              checked={!!notifPrefs[item.key]}
              onChange={(e) => setNotifPrefs((prev) => ({ ...prev, [item.key]: e.target.checked }))}
              className="w-4 h-4 accent-indigo-600"
            />
          </label>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <h3 className="text-sm font-semibold text-rose-500">Reset Demo Workspace</h3>
          <p className={`mt-1 ${theme.textMuted}`}>
            Restore all initial projects, tasks, and calendar events to default state.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetDemoData}
          className="min-h-[40px] px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Data
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 14. VIEW 10: USER PROFILE CUSTOMIZATION
// ============================================================================

function ProfileView({ user, setUser, tasks, projects, showToast, theme }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [location, setLocation] = useState(user.location);
  const [bio, setBio] = useState(user.bio);
  const [accent, setAccent] = useState(user.accent);

  const accents = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  const handleSave = (e) => {
    e.preventDefault();
    const initials = name
      .trim()
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    setUser({ ...user, name: name.trim(), role, email, location, bio, accent, avatarInitials: initials || 'JA' });
    showToast('Profile updated across workspace');
  };

  const myTasks = tasks.filter((t) => t.assigneeId === user.id);

  return (
    <div className="max-w-4xl space-y-6">
      <div className={`p-6 rounded-xl border ${theme.bgCard} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
            style={{ backgroundColor: accent }}
          >
            {user.avatarInitials}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
            <p className="text-xs text-indigo-500 font-medium">{user.role}</p>
            <p className={`text-xs mt-1 flex items-center gap-1.5 ${theme.textMuted}`}>
              <MapPin className="w-3.5 h-3.5" /> {user.location}
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-xs">
          <div>
            <p className="text-xl font-bold">{myTasks.length}</p>
            <p className={theme.textMuted}>Assigned Tasks</p>
          </div>
          <div>
            <p className="text-xl font-bold">{projects.length}</p>
            <p className={theme.textMuted}>Active Projects</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className={`p-6 rounded-xl border ${theme.bgCard} space-y-4 text-xs`}>
        <h2 className="text-base font-semibold">Edit Profile Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1.5">Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full min-h-[42px] px-3.5 rounded-lg border ${theme.border} bg-transparent`}
            />
          </div>
          <div>
            <label className="block font-medium mb-1.5">Role Title</label>
            <input
              required
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full min-h-[42px] px-3.5 rounded-lg border ${theme.border} bg-transparent`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1.5">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full min-h-[42px] px-3.5 rounded-lg border ${theme.border} bg-transparent`}
            />
          </div>
          <div>
            <label className="block font-medium mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full min-h-[42px] px-3.5 rounded-lg border ${theme.border} bg-transparent`}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1.5">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`w-full p-3.5 rounded-lg border ${theme.border} bg-transparent`}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Avatar Accent Color</label>
          <div className="flex gap-2.5">
            {accents.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccent(c)}
                className={`w-8 h-8 rounded-full transition ${accent === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="min-h-[44px] px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// 15. TASK CREATE / EDIT MODAL (WITH SUBTASKS CHECKLIST)
// ============================================================================

function TaskFormModal({ state, onClose, onSave, onDelete, projects, team, currentUserId, theme }) {
  const { open, task, defaultStatus, defaultProjectId, defaultDate, defaultAssigneeId } = state;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('proj-1');
  const [status, setStatus] = useState('Backlog');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState(currentUserId);
  const [estimateHours, setEstimateHours] = useState(4);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setProjectId(task.projectId);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setAssigneeId(task.assigneeId || currentUserId);
      setEstimateHours(task.estimateHours || 4);
      setSubtasks(task.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId || projects[0]?.id || 'proj-1');
      setStatus(defaultStatus || 'Backlog');
      setPriority('Medium');
      setDueDate(defaultDate || getRelativeDate(3));
      setAssigneeId(defaultAssigneeId || currentUserId);
      setEstimateHours(4);
      setSubtasks([]);
    }
    setNewSubtaskTitle('');
  }, [task, open, defaultStatus, defaultProjectId, defaultDate, defaultAssigneeId, projects, currentUserId]);

  if (!open) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [...prev, { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), done: false }]);
    setNewSubtaskTitle('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      projectId,
      status,
      priority,
      dueDate,
      assigneeId,
      estimateHours: Number(estimateHours) || 4,
      subtasks
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full max-w-xl p-5 sm:p-6 rounded-2xl border shadow-2xl ${theme.bgCard} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-2">
            {task && <span className="font-mono-code text-xs text-indigo-500 font-bold">{task.id}</span>}
            <h3 className="text-base font-bold">{task ? 'Edit Task' : 'Create New Task'}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-medium mb-1">Task Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth2 token refresh middleware"
              className={`w-full min-h-[42px] px-3.5 rounded-lg border ${theme.border} bg-transparent`}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Acceptance criteria, technical notes, or links..."
              className={`w-full p-3 rounded-lg border ${theme.border} bg-transparent`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium mb-1">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} ${theme.bgCard}`}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} ${theme.bgCard}`}
              >
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} ${theme.bgCard}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} ${theme.bgCard}`}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} bg-transparent`}
              />
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className={`p-3.5 rounded-xl border ${theme.border} space-y-2.5`}>
            <label className="block font-semibold">Subtasks ({subtasks.filter((s) => s.done).length}/{subtasks.length})</label>
            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.done}
                      onChange={() =>
                        setSubtasks((prev) => prev.map((item) => (item.id === st.id ? { ...item, done: !item.done } : item)))
                      }
                      className="accent-indigo-600"
                    />
                    <span className={st.done ? 'line-through opacity-60' : ''}>{st.title}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSubtasks((prev) => prev.filter((item) => item.id !== st.id))}
                    className="text-rose-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add checklist item..."
                className={`flex-1 min-h-[36px] px-3 rounded-lg border ${theme.border} bg-transparent`}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className={`px-3 min-h-[36px] rounded-lg border ${theme.border} font-medium`}
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3">
            {task ? (
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="min-h-[40px] px-3.5 rounded-lg text-rose-500 hover:bg-rose-500/10 font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className={`min-h-[40px] px-4 rounded-lg border ${theme.border}`}>
                Cancel
              </button>
              <button type="submit" className="min-h-[40px] px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================================================
// 16. PROJECT CREATE / EDIT MODAL
// ============================================================================

function ProjectFormModal({ state, onClose, onSave, team, currentUserId, theme }) {
  const { open, project } = state;
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [status, setStatus] = useState('On Track');
  const [deadline, setDeadline] = useState(getRelativeDate(14));

  useEffect(() => {
    if (project) {
      setName(project.name);
      setKey(project.key);
      setDescription(project.description || '');
      setColor(project.color || '#4F46E5');
      setStatus(project.status || 'On Track');
      setDeadline(project.deadline || getRelativeDate(14));
    } else {
      setName('');
      setKey('');
      setDescription('');
      setColor('#4F46E5');
      setStatus('On Track');
      setDeadline(getRelativeDate(14));
    }
  }, [project, open]);

  if (!open) return null;

  const colors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: project?.id,
      name: name.trim(),
      key: (key.trim() || name.trim().slice(0, 4)).toUpperCase(),
      description: description.trim(),
      color,
      status,
      deadline,
      leadId: project?.leadId || currentUserId,
      memberIds: project?.memberIds || team.slice(0, 3).map((m) => m.id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${theme.bgCard}`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <h3 className="text-base font-bold">{project ? 'Edit Project' : 'Launch New Project'}</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-medium mb-1">Project Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cloud Billing v2"
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} bg-transparent`}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Key Code</label>
              <input
                type="text"
                maxLength={5}
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="BILL"
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} bg-transparent font-mono-code`}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objectives, deliverables, and key milestones..."
              className={`w-full p-3 rounded-lg border ${theme.border} bg-transparent`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Health Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} ${theme.bgCard}`}
              >
                <option>On Track</option>
                <option>At Risk</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Target Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full min-h-[40px] px-3 rounded-lg border ${theme.border} bg-transparent`}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Project Color</label>
            <div className="flex gap-2.5">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className={`min-h-[40px] px-4 rounded-lg border ${theme.border}`}>
              Cancel
            </button>
            <button type="submit" className="min-h-[40px] px-5 rounded-lg bg-indigo-600 text-white font-semibold">
              {project ? 'Save Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================================================
// 17. GLOBAL COMMAND PALETTE (CMD + K)
// ============================================================================

function CommandPaletteModal({ open, onClose, tasks, projects, navigate, onSelectTask, onCreateTask, theme }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const matchedTasks = tasks
    .filter((t) => !q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden ${theme.bgCard}`}
      >
        <div className={`px-4 py-3.5 border-b ${theme.border} flex items-center gap-3`}>
          <Search className="w-4 h-4 text-indigo-500" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to task, project, or action..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
          <button onClick={onClose} className="text-xs opacity-60 hover:opacity-100">
            ESC
          </button>
        </div>

        <div className="p-2.5 max-h-80 overflow-y-auto space-y-3 text-xs">
          <div>
            <p className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>Quick Actions</p>
            <button
              onClick={onCreateTask}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-left ${theme.hoverRow}`}
            >
              <Plus className="w-4 h-4 text-indigo-500" />
              <span>Create New Task</span>
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('landing');
              }}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-left ${theme.hoverRow}`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>View Product Landing Page</span>
            </button>
          </div>

          <div>
            <p className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>Tasks</p>
            {matchedTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTask(t)}
                className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left ${theme.hoverRow}`}
              >
                <span className="truncate">
                  <span className="font-mono-code text-indigo-500 mr-2">{t.id}</span>
                  {t.title}
                </span>
                <span className={`text-[11px] ml-2 ${theme.textMuted}`}>{t.status}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}