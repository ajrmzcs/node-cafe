require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

// app.use es para agregar middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

const dbUrl = process.env.URLDB;

mongoose.connect(dbUrl, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log(`mongoose connection open to ${dbUrl}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`mongoose connection err: `, err);
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});