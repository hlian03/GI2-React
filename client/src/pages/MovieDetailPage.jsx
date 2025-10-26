import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

function MovieSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a movie name!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieName: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data || []);
    } catch (err) {
      setError(
        "Failed to fetch movies. Make sure your backend is running on port 5000."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="challenge-header">
        <h2>🎬 Movie Search App</h2>
        <span className="difficulty medium">Medium Challenge</span>
      </div>

      <div className="movie-search-section">
        <form onSubmit={handleSearch} className="movie-search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="movie-search-input"
          />
          <button type="submit" className="movie-search-btn">
            Search
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">Loading...</p>}

        <div className="movies-grid">
          {movies.length > 0
            ? movies.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                  ) : (
                    <div className="movie-no-poster">No Image</div>
                  )}
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-year">
                      {movie.release_date
                        ? movie.release_date.substring(0, 4)
                        : "N/A"}
                    </p>
                    <div className="movie-rating">
                      ⭐{" "}
                      {movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "N/A"}
                    </div>
                  </div>
                </div>
              ))
            : !loading &&
              searchQuery && <p className="no-results">No movies found.</p>}
        </div>
      </div>
    </div>
  );
}

export default MovieSearch;
