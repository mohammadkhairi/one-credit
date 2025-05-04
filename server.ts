// server.ts
import { app, db } from './app';

// Connect to the DB

// Start the server
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Gracefully handle shutdown (e.g., SIGTERM or SIGINT)
const closeServer = async () => {
  console.log('Closing server...');
  await db.close(); // Close MongoDB connection
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', closeServer); // Handle termination signal (e.g., Ctrl + C)
process.on('SIGINT', closeServer);  // Handle interrupt signal