'use strict';


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reduce = require('lodash.reduce');
const axios = require('axios');
const PORT = process.env.PORT || 3001;

const app = express();

// middleware
app.use(cors());

app.listen(PORT, () => console.log(`listening on ${PORT}`));

const errorHandler = (res, err = null) => {
    if (err) {
        console.log(err);
        return res.status(500).send({ error: "Something went wrong" }
        );
    }
}

class Forecast {
    constructor(date, desc) {
        this.date = new Date(date);
        this.description = desc;
    }
}

class Movie {
    constructor(
        overview,
        popularity,
        poster_path,
        release_date,
        title,
        vote_average,
        vote_count) {
        this.overview = overview
        this.popularity = popularity
        this.poster_path = poster_path
        this.release_date = release_date
        this.title = title
        this.vote_average = vote_average
        this.vote_count = vote_count
    }
}

app.get('/', (_req, res) => {
    res.send("Hello from Express");
})

app.get('/movies', async (req, res) => {
    const { MOVIE_API_KEY, MOVIE_URL } = process.env;
    const { searchQuery } = req.query;
    let url = `${MOVIE_URL}?query=${searchQuery}&api_key=${MOVIE_API_KEY}`;
    try {
        let { data: { results } } = await axios.get(url);
        let resp = reduce(results, (acc, movie) => {
            console.log(movie)
            let { title, overview, popularity,
                vote_average, vote_count,
                poster_path, release_date } = movie;
            acc.push(new Movie(
                overview,
                popularity,
                poster_path,
                release_date,
                title,
                vote_average,
                vote_count
            ));
            return acc;
        }, []);
        res.send(resp);
    } catch (error) {
        errorHandler(res, error);
    }
})

app.get('/weather', async (req, res) => {
    const { WEATHER_API_KEY, WEATHER_URL } = process.env;
    const { lat, lon } = req.query;
    let url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;
    try {
        let { data } = await axios.get(url);
        let resp = reduce(data.data, (acc, day) => {
            let { datetime, min_temp, max_temp, weather: { description } } = day;
            let desc = `Low of ${min_temp}, high of ${max_temp} with ${description}`;
            acc.push(new Forecast(datetime, desc));
            return acc;
        }, [])
        res.send(resp);
    } catch (error) {
        errorHandler(res, error);
    }
})
