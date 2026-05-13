import { TaskModel } from '../models/taskModel.js';

const validateTaskId = (id) => {
  const numericId = Number(id);

  if (!numericId || Number.isNaN(numericId)) {
    const error = new Error('Valid task id is required');
    error.statusCode = 400;
    throw error;
  }

  return numericId;
};

const validateTaskTitle = (title) => {
  if (!title || !title.trim()) {
    const error = new Error('Task title is required');
    error.statusCode = 400;
    throw error;
  }

  if (title.trim().length > 255) {
    const error = new Error('Task title must be less than 255 characters');
    error.statusCode = 400;
    throw error;
  }

  return title.trim();
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await TaskModel.getAllTasks();
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const title = validateTaskTitle(req.body.title);
    const dueDate = req.body.due_date || null;

    const task = await TaskModel.createTask(title, dueDate);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const id = validateTaskId(req.params.id);
    const title = validateTaskTitle(req.body.title);
    const dueDate = req.body.due_date || null;

    const existingTask = await TaskModel.getTaskById(id);

    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedTask = await TaskModel.updateTask(id, title, dueDate);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const id = validateTaskId(req.params.id);
    const existingTask = await TaskModel.getTaskById(id);

    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    await TaskModel.deleteTask(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req, res, next) => {
  try {
    const id = validateTaskId(req.params.id);
    const existingTask = await TaskModel.getTaskById(id);

    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const completedTask = await TaskModel.completeTask(id);

    res.status(200).json({
      success: true,
      message: 'Task marked as completed',
      data: completedTask
    });
  } catch (error) {
    next(error);
  }
};