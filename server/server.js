require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

// app.use is for adding middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes global configuration
app.use(require('./routes/index'));

const dbUrl = process.env.URLDB;

mongoose.connect(dbUrl, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log(`mongoose connection open to ${dbUrl}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`mongoose connection err: `, err);
});

app.listen(process.env.PORT, () => {
    console.log('Listening port:', process.env.PORT);
});