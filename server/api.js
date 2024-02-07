var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var http = require('http');
var dotenv = require('dotenv');
var socketSetup = require('./socketSetup');
var userRoutes = require('./routes/user');
dotenv.config();
var PORT = process.env.PORT;
var mongoURL = process.env.MONGO_URL;
var app = express();
var server = http.Server(app);
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
server.listen(PORT, function () {
    console.log("Server listening on ".concat(PORT));
});
