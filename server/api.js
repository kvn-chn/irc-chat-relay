const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const socketSetup = require('./socketSetup');
const cookieParser = require('cookie-parser');

dotenv.config();
const PORT = process.env.PORT || 4000;
const mongoURL = process.env.MONGO_URL;

const app = express();
const server = http.Server(app);

mongoose.connect(mongoURL).then(function () {
  console.log('Connected to MongoDB');
});

const registerRoutes = require('./routes/register');
const tokenRoutes = require('./routes/token');
const loginRoutes = require('./routes/login');

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/clear', tokenRoutes);

socketSetup(server);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});