require('dotenv').config();
const express = require('express');
const app = express();

const { connectToDatabase } = require('./utils/db');
const { PORT } = require('./utils/config');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const authorRouter = require('./controllers/authors');
const readingListsRouter = require('./controllers/readingLists');

// eslint-disable-next-line no-unused-vars
const errorHandling = (err, req, res, next) => {
  res.status(500).json({ error: err.message });
};

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/authors', authorRouter);
app.use('/api/readingLists', readingListsRouter);

app.use(errorHandling);

const start = async () => {
  // the below ensures we connect to the db before starting the application
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
