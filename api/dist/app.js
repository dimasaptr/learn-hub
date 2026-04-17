import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/users/user.routes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Event Management Platform API is running',
        status: 'success'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found',
        status: 'error'
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        status: 'error'
    });
});
export default app;
