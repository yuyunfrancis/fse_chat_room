const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const userRouter = require('./routes/userRoutes');
const User = require('./models/userModel');

const { SESSION_SECRET } = process.env;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

//2) STATIC FILES
app.use(express.static(`${__dirname}/public`));
app.use('/css', express.static(`${__dirname}/public/css`));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(userRouter);

//3) ROUTES
app.use('/api/v1/users', userRouter);

//4) SOCKET.IO
const userNamespace = io.of('/user-namespace');

userNamespace.on('connection', async (socket) => {
  console.log('Connected to user namespace');

  console.log(socket.handshake.auth.token);
  var userId = socket.handshake.auth.token;
  await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '1' } });

  socket.on('disconnect', async () => {
    console.log('User disconnected');

    // var userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '0' } });

    socket.broadcast.emit('getOfflineUser', { user_id: userId });
  });

  // chat implementation
  socket.on('newChat', function (data) {
    socket.broadcast.emit('loadNewChat', data);
  });
});

module.exports = { app, server };
