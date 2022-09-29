const reduce = require('lodash.reduce');
const axios = require('axios');

const weatherEndpoint = async (req, res) => {
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
}

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

module.exports = weatherEndpoint;