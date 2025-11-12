const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testAPIRouter = require('./routes/testAPI');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./authenticationRoutes/RegistrationEndpoint');
const gpt2Route = require('./routes/gpt2');
const ollamaRouter = require('./routes/ollama');
const folderRoutes = require('./routes/folderRoutes');

// DB
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();
console.log('MongoDB connected');

// --- Middleware ---
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- View engine setup ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// --- Routes ---
// Jade pages / legacy routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);

// API routes
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/generate', gpt2Route); //now its used for ollama but I didnt want to change the name
app.use('/api/ollama', ollamaRouter);
app.use('/api/folders', folderRoutes);

// --- 404 handler ---
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.status(404).render('error');
});

// --- General error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  } else {
    res.status(err.status || 500).render('error');
  }
});



// Export app for bin/www
module.exports = app;