const fetch = require("node-fetch");
require("dotenv").config();
const API_KEY = process.env.API_KEY;

async function mySimilar(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);

  const data = await res.json();
  return data.results;
}

module.exports = mySimilar;
