const reduce = require('lodash.reduce');
const axios = require('axios');
const cache = require('./cache');
const res = require('express/lib/response');

const movieEndpoint = async (req, res) => {
    const { MOVIE_API_KEY, MOVIE_URL } = process.env;
    const { searchQuery } = req.query;
    let key = 'movie-' + searchQuery;
    let url = `${MOVIE_URL}?query=${searchQuery}&api_key=${MOVIE_API_KEY}`;
    try {
        let resp = await getMovies(key, url);
        res.send(resp);
    } catch (error) {
        errorHandler(res, error);
    }
}

async function getMovies(key, url) {
    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
        console.log('Cache hit');
        let resp = cache[key].data;
        return resp;
    } else {
        console.log('Cache miss');
        cache[key] = {};
        cache[key].timestamp = Date.now();
        let { data: { results } } = await axios.get(url);
        let resp = reduce(results, (acc, { title, overview, popularity,
            vote_average, vote_count,
            poster_path, release_date }) => {
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
        cache[key].data = resp;
        return resp;
    }
}

const errorHandler = (res, err = null) => {
    if (err) {
        console.log(err);
        return res.status(500).send({ error: "Something went wrong" }
        );
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

module.exports = movieEndpoint;