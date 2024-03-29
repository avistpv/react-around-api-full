require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogin, errorLogin } = require('./middleware/loging');
const errorhandler = require('./middleware/errorhandler');
const NotFoundError = require('./utils/notfounderror');
const { limiter } = require('./utils/ratelimiter');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { DB_LINK = 'mongodb://127.0.0.1/aroundb' } = process.env;
mongoose.connect(DB_LINK);

const { PORT = 3000, NODE_ENV } = process.env;
const app = express();

app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(helmet());
app.use(requestLogin);

// Server crash testing
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', usersRouter, cardsRouter);
app.use('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found.'));
});
app.use(errorLogin);
app.use(errors());
app.use(errorhandler);

if (NODE_ENV !== 'test') app.listen(PORT);
