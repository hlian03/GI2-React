const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mySearch = require("./modules/mySearch");
const mySimilar = require("./modules/mySimilar");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // allow frontend to fetch
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Movie backend is running!");
});

app.post("/search", async (req, res) => {
  try {
    const { movieName } = req.body;
    if (!movieName)
      return res.status(400).json({ error: "Movie name required" });

    const results = await mySearch(movieName);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/similar", async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ error: "Movie ID required" });

    const results = await mySimilar(movieId);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
