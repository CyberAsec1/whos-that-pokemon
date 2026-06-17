const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Who's That Pokémon API is running!");
});

// 🎮 RANDOM POKÉMON ROUTE
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

    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokémon" });
  }
});

// 🎯 GUESS POKÉMON ROUTE
app.post("/api/pokemon/guess", async (req, res) => {
  try {
    const { id, guess } = req.body;

    // Validate that the request has the required data
    if (!id || !guess) {
      return res.status(400).json({ error: "Missing id or guess in request body" });
    }

    // Fetch the correct answer from PokeAPI using the ID
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    
    const correctName = data.name.toLowerCase();
    const userGuess = guess.trim().toLowerCase();

    // Compare the names
    if (userGuess === correctName) {
      res.json({ correct: true, message: `Correct! It is ${data.name}.` });
    } else {
      res.json({ correct: false, message: "Wrong answer! Try again." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to validate guess" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
