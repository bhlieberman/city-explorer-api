'use strict';

// const forecast = require('./forecast.js');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reduce = require('lodash.reduce');
// Read in the shopping list from our "Database" (flat file)
const data = require('./data/weather.json');

const app = express();

// middleware
app.use(cors());

const PORT = process.env.PORT || 3001;

class Forecast {
    constructor(date, desc) {
        this.date = date;
        this.description = desc;
    }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/', (req, res) => {
    res.send("Hello from Express");
})

app.get('/weather', (req, res) => {
    let { lat, lon, searchQuery } = req.query;
    let response = reduce(data, (acc, city) => {
        if (city.city_name === searchQuery) {
            let data = city.data.map(data => {
                let desc = `Low of ${data.low_temp}, high of ${data.max_temp} with ${data.weather.description}`;
                return new Forecast(data.datetime, desc);
            });
            acc = acc.concat(data);
        }
        return acc;
    }, []);
    if (response) res.send(response);
    else res.status(404).send('not found');
})