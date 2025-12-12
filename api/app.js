//app.js

require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

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

//defensive middleware to prevent errors when loading the build
// defend against invalid percent-encoded paths (prevents URIError)
app.use((req, res, next) => {
  try {
    // try decoding path — will throw for invalid percent encodings
    decodeURIComponent(req.path);
    next();
  } catch (err) {
    console.warn('Bad request path (invalid percent-encoding):', req.path);
    // respond with a safe 400 instead of letting Express crash
    return res.status(400).json({ message: "Bad request" });
  }
});


// If behind a reverse proxy (Cloudflare), trust the proxy so req.secure and
// req.protocol reflect the original TLS connection. Set to 1 for single
// proxy hop (Cloudflare). This allows secure cookies to work when Cloudflare
// terminates TLS at the edge.
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

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
// Note: the root index route is disabled so the React build is served instead.
// If you need legacy pages, re-enable the line below.
// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);

// API routes
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/generate', gpt2Route); //now its used for ollama but I didnt want to change the name
app.use('/api/ollama', ollamaRouter);
app.use('/api/folders', folderRoutes);

app.use((req, res, next) => {
  const path = req.originalUrl;
  if (path.includes('..')) {
    console.log(`Blocked directory traversal attempt: ${path}`);
    return res.status(400).send('Bad Request');
  }
  next();
});


// --- Serve React Frontend --- after running npm run build
// Serve React build static files
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

// Set up a basic rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});

app.use(limiter); // Apply rate limit to all routes


// For any non-API route, serve index.html (React app handles routing)
app.get('*', (req, res, next) => {
  if (req.originalUrl && req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

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

app.use((req, res, next) => {
  // List of malicious paths/patterns to block
  const blockedPatterns = [
    /wp-admin/,
    /wp-login\.php/,
    /xmlrpc\.php/,
    /wp-content\/.*\.php/, // Match any PHP files in wp-content
    /wp-includes\/.*\.php/, // Match any PHP files in wp-includes
    /wp-config\.php/,       // Block access to wp-config.php (important security file)
    /wp-signin\.php/,
    /wp-user\.php/,
    /xmrlpc\.php/,
    /wp\.php/,
    /autoload_classmap\.php/, // Various autoloading PHP scripts
    /simplepie\.php/,
    /requests\.php/,
    /index\.php/,
    /admin\.php/,
    /sitemap\.php/,
    /backups-dup-lite\//,   // Block backups-related access
    /themes\/.*\.php/,      // Block any PHP in the themes directory
    /plugins\/.*\.php/,     // Block any PHP in the plugins directory
    /uploads\/.*\.php/      // Block any PHP in the uploads directory
  ];

  // If request matches any of the blocked patterns, send a 403 Forbidden status
  for (let pattern of blockedPatterns) {
    if (pattern.test(req.originalUrl)) {
      console.log(`Blocked malicious request: ${req.originalUrl}`);
      return res.status(403).send('Forbidden');
    }
  }

  next(); // Proceed if not blocked
});



// Export app for bin/www
module.exports = app;