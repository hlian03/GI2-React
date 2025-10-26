const searchMovies = async (movieName) => {
  const res = await fetch("http://localhost:5000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieName }),
  });
  const data = await res.json();
  console.log(data);
};
