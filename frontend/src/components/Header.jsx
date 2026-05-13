function Header({ darkMode, setDarkMode, totalTasks }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">React + Express + MySQL</p>
        <h1>Full Stack To-Do List</h1>
        <p className="subtitle">Clean responsive task manager with CRUD, filters, search, and dark mode.</p>
      </div>

      <div className="header-actions">
        <div className="task-count-card">
          <span>Total Tasks</span>
          <strong>{totalTasks}</strong>
        </div>

        <button type="button" className="theme-toggle" onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  );
}

export default Header;