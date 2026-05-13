import { pool } from '../config/db.js';

export const TaskModel = {
  async getAllTasks() {
    const [rows] = await pool.query('SELECT * FROM task5 ORDER BY created_at DESC');
    return rows;
  },

  async getTaskById(id) {
    const [rows] = await pool.query('SELECT * FROM task5 WHERE id = ?', [id]);
    return rows[0];
  },

  async createTask(title, dueDate = null) {
    const [result] = await pool.query(
      'INSERT INTO task5 (title, status, due_date) VALUES (?, ?, ?)',
      [title, 'pending', dueDate]
    );
    return this.getTaskById(result.insertId);
  },

  async updateTask(id, title, dueDate = null) {
    await pool.query(
      'UPDATE task5 SET title = ?, due_date = ? WHERE id = ?',
      [title, dueDate, id]
    );
    return this.getTaskById(id);
  },

  async deleteTask(id) {
    const [result] = await pool.query('DELETE FROM task5 WHERE id = ?', [id]);
    return result.affectedRows;
  },

  async completeTask(id) {
    await pool.query("UPDATE task5 SET status = 'completed' WHERE id = ?", [id]);
    return this.getTaskById(id);
  }
};