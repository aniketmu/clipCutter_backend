const express = require('express');
const bodyParser = require('body-parser');
import Login from './contorar/login';
import Register from './contorar/register';
import mongodb from './database/mongo'

const app = express();
app.use(bodyParser.json());
mongodb();

app.post('/api/register', Register);

app.post('/api/login', Login);

module.exports = app;

