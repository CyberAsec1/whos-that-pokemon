const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// 🏠 Home route
app.get("/get", (req, res) => {
  res.send("Who's That Pokémon API is running!");
});

// 🎮 Random Pokémon
app.get("/api/pokemon/random", async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 151) + 1;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();

    res.json({
      id: data.id,
      image: data.sprites.front_default
      // name is hidden for the game
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokémon" });
  }
});

// 🧠 Check answer route
app.get("/api/pokemon/check", (req, res) => {
  const { guess, answer } = req.query;

  if (!guess || !answer) {
    return res.status(400).json({ error: "Missing data" });
  }

  const isCorrect = guess.toLowerCase() === answer.toLowerCase();

  res.json({
    correct: isCorrect
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});