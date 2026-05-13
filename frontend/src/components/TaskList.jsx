import TaskItem from './TaskItem';

function TaskList({ tasks, loading, onEdit, onDelete, onComplete }) {
  if (loading) {
    return <div className="state-card">Loading tasks from backend...</div>;
  }

  if (!tasks.length) {
    return <div className="state-card">No tasks found. Add your first task.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}

export default TaskList;