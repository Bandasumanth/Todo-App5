import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskService } from './services/taskService';
import './styles/app.css';

const initialForm = {
  title: '',
  due_date: ''
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadFallbackTasks = () => {
    const stored = localStorage.getItem('todo_fallback_tasks');
    return stored ? JSON.parse(stored) : [];
  };

  const saveFallbackTasks = (nextTasks) => {
    localStorage.setItem('todo_fallback_tasks', JSON.stringify(nextTasks));
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getTasks();
      setTasks(response.data.data);
      setUsingFallback(false);
    } catch (err) {
      const fallback = loadFallbackTasks();
      setTasks(fallback);
      setUsingFallback(true);
      setError('Backend unavailable. Local storage fallback is active.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingTaskId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      if (usingFallback) {
        const nextTasks = editingTaskId
          ? tasks.map((task) =>
              task.id === editingTaskId
                ? { ...task, title: formData.title.trim(), due_date: formData.due_date || null }
                : task
            )
          : [
              {
                id: Date.now(),
                title: formData.title.trim(),
                due_date: formData.due_date || null,
                status: 'pending',
                created_at: new Date().toISOString()
              },
              ...tasks
            ];

        setTasks(nextTasks);
        saveFallbackTasks(nextTasks);
        setToast(editingTaskId ? 'Task updated locally.' : 'Task added locally.');
        resetForm();
        return;
      }

      if (editingTaskId) {
        const response = await taskService.updateTask(editingTaskId, {
          title: formData.title.trim(),
          due_date: formData.due_date || null
        });
        setTasks((prev) => prev.map((task) => (task.id === editingTaskId ? response.data.data : task)));
        setToast('Task updated successfully.');
      } else {
        const response = await taskService.createTask({
          title: formData.title.trim(),
          due_date: formData.due_date || null
        });
        setTasks((prev) => [response.data.data, ...prev]);
        setToast('Task added successfully.');
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');

      if (usingFallback) {
        const nextTasks = tasks.filter((task) => task.id !== id);
        setTasks(nextTasks);
        saveFallbackTasks(nextTasks);
        setToast('Task deleted locally.');
        return;
      }

      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setToast('Task deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      due_date: task.due_date ? task.due_date.split('T')[0] : ''
    });
  };

  const handleComplete = async (id) => {
    try {
      setError('');

      if (usingFallback) {
        const nextTasks = tasks.map((task) =>
          task.id === id ? { ...task, status: 'completed' } : task
        );
        setTasks(nextTasks);
        saveFallbackTasks(nextTasks);
        setToast('Task completed locally.');
        return;
      }

      const response = await taskService.completeTask(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? response.data.data : task)));
      setToast('Task marked as completed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task.');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchFilter =
        filter === 'all' ||
        (filter === 'completed' && task.status === 'completed') ||
        (filter === 'pending' && task.status === 'pending');

      const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [tasks, filter, searchTerm]);

  const counts = {
    all: tasks.length,
    completed: tasks.filter((task) => task.status === 'completed').length,
    pending: tasks.filter((task) => task.status === 'pending').length
  };

  return (
    <div className="app-shell">
      <div className="app-card">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} totalTasks={tasks.length} />

        <div className="toolbar-grid">
          <TaskForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            submitting={submitting}
            editingTaskId={editingTaskId}
            onCancel={resetForm}
          />

          <div className="side-panel">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <TaskFilters filter={filter} setFilter={setFilter} counts={counts} />
          </div>
        </div>

        {usingFallback && <p className="info-banner">Local fallback mode enabled.</p>}
        {error && <p className="error-message">{error}</p>}
        {toast && <div className="toast-message">{toast}</div>}

        <section className="task-section">
          <div className="section-heading">
            <div>
              <h2>Task List</h2>
              <p>Tasks stay permanent in MySQL after refresh when backend is connected.</p>
            </div>
            <span className="task-summary">{filteredTasks.length} visible</span>
          </div>

          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        </section>
      </div>
    </div>
  );
}

export default App;