const reduce = require('lodash.reduce');
const axios = require('axios');

const movieEndpoint = async (req, res) => {
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