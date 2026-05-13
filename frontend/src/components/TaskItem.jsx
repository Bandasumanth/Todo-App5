function TaskItem({ task, onEdit, onDelete, onComplete }) {
  const createdAt = task.created_at ? new Date(task.created_at).toLocaleString() : 'Not available';
  const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date';

  return (
    <article className={task.status === 'completed' ? 'task-item completed' : 'task-item'}>
      <div className="task-content">
        <div className="task-top-row">
          <h3>{task.title}</h3>
          <span className={task.status === 'completed' ? 'status-badge done' : 'status-badge pending'}>
            {task.status}
          </span>
        </div>
        <p><strong>Created:</strong> {createdAt}</p>
        <p><strong>Due:</strong> {dueDate}</p>
      </div>

      <div className="task-actions">
        <button type="button" className="edit-btn" onClick={() => onEdit(task)}>Edit</button>
        <button type="button" className="delete-btn" onClick={() => onDelete(task.id)}>Delete</button>
        {task.status !== 'completed' && (
          <button type="button" className="complete-btn" onClick={() => onComplete(task.id)}>
            Mark Completed
          </button>
        )}
      </div>
    </article>
  );
}

export default TaskItem;