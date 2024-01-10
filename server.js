const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const { app, server } = require('./app');
const connectDb = require('./config/dbConnection');

connectDb();
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
