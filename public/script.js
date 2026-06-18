let gameId = null;
let currentPokemon = null;
let hintsRevealed = 0;
let wrongGuesses = 0;
const MAX_WRONG_GUESSES = 3;

// Start a new game
async function loadPokemon() {
  try {
    const res = await fetch("/new");
    const data = await res.json();

    gameId = data.game_id;
    hintsRevealed = 0;

    // Fetch the Pokémon details
    const pokemonId = atob(gameId);
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemon = await pokemonRes.json();
    currentPokemon = pokemon;

    // Display the Pokémon image (silhouette) - use HD official artwork
    const imageUrl = pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default;
    document.getElementById("pokemonImage").src = imageUrl;
    document.getElementById("pokemonImage").style.filter = "brightness(0)";
    document.getElementById("result").innerText = "";
    document.getElementById("guessInput").value = "";
    document.getElementById("hints").innerText = "";
    wrongGuesses = 0;
    document.getElementById("guessCount").innerText = `Wrong guesses: 0/${MAX_WRONG_GUESSES}`;
  } catch (error) {
    console.error("Error loading Pokémon:", error);
    document.getElementById("result").innerText = "Error starting game";
  }
}

// Get a hint
async function getHint() {
  if (!gameId) {
    document.getElementById("result").innerText = "Start a game first!";
    return;
  }

  try {
    hintsRevealed += 1;
    const res = await fetch(`/hint/${gameId}/${hintsRevealed}`);
    const data = await res.json();

    if (data.error) {
      document.getElementById("result").innerText = data.error;
      hintsRevealed -= 1;
      return;
    }

    let hintText = document.getElementById("hints").innerText || "";
    hintText += `Hint ${data.hint} (${data.category}): ${data.value}\n`;
    document.getElementById("hints").innerText = hintText;
  } catch (error) {
    console.error("Error getting hint:", error);
    document.getElementById("result").innerText = "Error getting hint";
    hintsRevealed -= 1;
  }
}

// Check guess
async function checkGuess() {
  const guess = document.getElementById("guessInput").value.trim();

  if (!gameId) {
    document.getElementById("result").innerText = "Start a game first!";
    return;
  }

  if (!guess) {
    document.getElementById("result").innerText = "Enter a Pokémon name!";
    return;
  }

  try {
    const res = await fetch(`/guess/${gameId}/${guess}`);
    const data = await res.json();

    if (data.correct) {
      document.getElementById("result").innerText = `✅ Correct! It was ${data.pokemon}!`;
      document.getElementById("pokemonImage").style.filter = "brightness(1)";
    } else {
      wrongGuesses++;
      document.getElementById("guessCount").innerText = `Wrong guesses: ${wrongGuesses}/${MAX_WRONG_GUESSES}`;
      
      if (wrongGuesses >= MAX_WRONG_GUESSES) {
        document.getElementById("result").innerText = `😅 Out of guesses! It was ${data.pokemon}!`;
        document.getElementById("pokemonImage").style.filter = "brightness(1)";
      } else {
        const remaining = MAX_WRONG_GUESSES - wrongGuesses;
        document.getElementById("result").innerText = `❌ Wrong! ${remaining} guess${remaining === 1 ? "" : "es"} remaining.`;
      }
    }
    document.getElementById("guessInput").value = "";
  } catch (error) {
    console.error("Error checking guess:", error);
    document.getElementById("result").innerText = "Error checking guess";
  }
}

// Give up and reveal answer
async function giveUp() {
  if (!gameId || !currentPokemon) {
    document.getElementById("result").innerText = "Start a game first!";
    return;
  }

  document.getElementById("result").innerText = `🏳️ You gave up! It was ${currentPokemon.name}!`;
  document.getElementById("pokemonImage").style.filter = "brightness(1)";
  document.getElementById("guessInput").disabled = true;
}

// Start game on load
loadPokemon();
