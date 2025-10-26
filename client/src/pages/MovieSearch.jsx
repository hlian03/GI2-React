import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/MovieSearch.css";

const BACKEND_URL = "http://localhost:5000";

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
    fetchSimilarMovies();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${
          process.env.REACT_APP_TMDB_API_KEY ||
          "82b1b7ad01110e956ebccb558105de2e"
        }`
      );
      const data = await response.json();
      setMovie(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/similar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: id }),
      });
      const data = await response.json();
      setSimilarMovies(data.slice(0, 6) || []);
    } catch (err) {
      console.error("Error fetching similar movies:", err);
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (!movie) return <div className="error-message">Movie not found</div>;

  return (
    <div className="page-wrapper">
      <button onClick={() => navigate("/movies")} className="back-btn">
        ← Back to Search
      </button>

      <div className="movie-detail-container">
        <div className="movie-detail-poster">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className="no-poster-large">No Image</div>
          )}
        </div>

        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}

          <div className="movie-meta">
            <span>
              <strong>Release:</strong> {movie.release_date || "N/A"}
            </span>
            <span>
              <strong>Rating:</strong> ⭐{" "}
              {movie.vote_average?.toFixed(1) || "N/A"}/10
            </span>
            <span>
              <strong>Runtime:</strong>{" "}
              {movie.runtime ? `${movie.runtime} min` : "N/A"}
            </span>
          </div>

          <div className="movie-genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="movie-overview">
            <h3>Overview</h3>
            <p>{movie.overview || "No overview available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
