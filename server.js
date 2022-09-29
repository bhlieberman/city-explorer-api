'use strict';


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const movieEndpoint = require('./movie');
const weatherEndpoint = require('./weather');
const PORT = process.env.PORT || 3001;

const app = express();

// middleware
app.use(cors());

app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/', (_req, res) => {
    res.send("Hello from Express");
})

app.get('/movies', movieEndpoint);

app.get('/weather', weatherEndpoint);
