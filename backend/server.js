import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
try {
  const conn = await pool.getConnection();
  console.log('MySQL connected successfully');
  conn.release();
} catch (err) {
  console.error('MySQL connection failed:', err);
}
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'To-Do API is running successfully'
  });
});

app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error.message);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
