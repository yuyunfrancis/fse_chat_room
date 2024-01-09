const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const userRouter = require('./routes/userRoutes');

const { SESSION_SECRET } = process.env;

const app = express();

//1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// static files
app.use(express.static(`${__dirname}/public`));
app.use('/css', express.static(`${__dirname}/public/css`));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(userRouter);

//2) ROUTES
app.use('/api/v1/users', userRouter);

module.exports = app;
