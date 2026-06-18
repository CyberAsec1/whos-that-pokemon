const path = require("path");
const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// in-memory storage for games
const games = {};

// helper: fetch Pokémon
async function getPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();
}

// 🎮 START GAME
app.get("/new", async (req, res) => {
  const id = Math.floor(Math.random() * 151) + 1;
  const pokemon = await getPokemon(id);

  const game_id = Buffer.from(String(id)).toString("base64");

  games[game_id] = {
    pokemon
  };

  res.json({
    game_id,
    hints: 5
  });
});

// 💡 HINTS
app.get("/hint/:game_id/:n", (req, res) => {
  const { game_id, n } = req.params;

  const game = games[game_id];

  if (!game) {
    return res.status(400).json({ error: "Invalid game_id" });
  }

  const pokemon = game.pokemon;

  const hints = [
    { category: "move", value: pokemon.moves[0]?.move.name },
    { category: "move", value: pokemon.moves[1]?.move.name },
    { category: "type", value: pokemon.types.map(t => t.type.name) },
    { category: "size", value: `Height: ${pokemon.height}, Weight: ${pokemon.weight}` },
    { category: "cry", value: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg` }
  ];

  const hintIndex = Number(n) - 1;

  if (hintIndex < 0 || hintIndex >= hints.length) {
    return res.status(400).json({
      error: `Hint ${n} does not exist (max ${hints.length})`
    });
  }

  res.json({
    hint: Number(n),
    ...hints[hintIndex]
  });
});

// 🎯 GUESS
app.get("/guess/:game_id/:guess", (req, res) => {
  const { game_id, guess } = req.params;

  const game = games[game_id];

  if (!game) {
    return res.status(400).json({ error: "Invalid game_id" });
  }

  const correct =
    guess.toLowerCase() === game.pokemon.name.toLowerCase();

  if (correct) {
    return res.json({
      correct: true,
      pokemon: game.pokemon.name
    });
  }

  res.json({ correct: false });
});

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
