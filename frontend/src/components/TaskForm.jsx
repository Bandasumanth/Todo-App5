function TaskForm({ formData, setFormData, handleSubmit, submitting, editingTaskId, onCancel }) {
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTaskId ? 'Edit Task' : 'Add Task'}</h2>

      <label htmlFor="taskTitle">Task Title</label>
      <input
        id="taskTitle"
        type="text"
        placeholder="Enter task title"
        value={formData.title}
        onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
      />

      <label htmlFor="dueDate">Due Date</label>
      <input
        id="dueDate"
        type="date"
        value={formData.due_date}
        onChange={(event) => setFormData((prev) => ({ ...prev, due_date: event.target.value }))}
      />

      <div className="form-actions">
        <button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? 'Saving...' : editingTaskId ? 'Update Task' : 'Add Task'}
        </button>

        {editingTaskId && (
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;