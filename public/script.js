let currentPokemon = null;

// Load random Pokémon
async function loadPokemon() {
  const res = await fetch("http://localhost:3000/api/pokemon/random");
  const data = await res.json();

  currentPokemon = data;

  document.getElementById("pokemonImage").src = data.image;
  document.getElementById("result").innerText = "";
  document.getElementById("guessInput").value = "";
}

// Check guess
async function checkGuess() {
  const guess = document.getElementById("guessInput").value;

  const res = await fetch(
    `http://localhost:3000/api/pokemon/check?guess=${guess}&answer=${currentPokemon.name || ""}`
  );

  const data = await res.json();

  document.getElementById("result").innerText =
    data.correct ? "✅ Correct!" : "❌ Wrong!";
}

// start game on load
loadPokemon();
