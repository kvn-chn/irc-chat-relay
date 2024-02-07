const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const socketSetup = require('./socketSetup');
const userRoutes = require('./routes/user');

dotenv.config();
const PORT = process.env.PORT;
const mongoURL = process.env.MONGO_URL;

const app = express();
const server = http.Server(app);

if (!mongoURL) {
  throw new Error("MONGO_URL environment variable is not defined");
}

mongoose.connect(mongoURL).then(function () {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use('/user', userRoutes);

socketSetup(server);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});