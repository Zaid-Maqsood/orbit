require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const deliverableRoutes = require('./routes/deliverableRoutes');
const portalRoutes = require('./routes/portalRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Jobs
const { startDeadlineChecker } = require('./jobs/deadlineChecker');

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/deliverables', deliverableRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/stats', statsRoutes);

// Central error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  startDeadlineChecker();
});

module.exports = app;
