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

    const pokemon = {
      name: data.name,
      image: data.sprites.front_default,
      id: data.id,
    };

    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokémon" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
https://pokeapi.co/api/v2/pokemon/