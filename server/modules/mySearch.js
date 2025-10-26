const fetch = require("node-fetch");
require("dotenv").config();
const API_KEY = process.env.API_KEY;

async function mySearch(movieName) {
  if (!movieName) throw new Error("No movie name provided");

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    movieName
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);

  const data = await res.json();
  return data.results;
}

module.exports = mySearch;
