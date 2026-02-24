/* Pokemon API JS 
CIS4004 2-17-26 */

const buildURL = name => `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`;

const fetchPokemon = name => {
  const cached = localStorage.getItem(name.toLowerCase().trim());
  if (cached) {
    console.log("Getting info for:", name);
    return Promise.resolve(JSON.parse(cached));
  }

  console.log("Fetching from API:", name);
  return fetch(buildURL(name)) // fetch from pokeAPI
    .then(response => {
      if (!response.ok) throw new Error("Pokemon not found");
      return response.json(); // .json() returns a promise
    })
    .then(data => {
      localStorage.setItem(name.toLowerCase().trim(), JSON.stringify(data));
      return data;
    });
};

// constants for getting data of searched pkm
const getMoves = data => data.moves.map(m => m.move.name);
const getSprite = data => data.sprites.front_default;
// audio for the pkm cry
const getSound = data =>
  data.cries?.latest ?? `https://play.pokemonshowdown.com/audio/cries/${data.name}.mp3`;

const searchBtn = document.getElementById('searchBtn');
const input = document.getElementById('pokeInput');
const card = document.getElementById('pokeDisplay');
const pokeImg = document.getElementById('pokePic');
const pokeName = document.getElementById('pokeName');
const pokeSound = document.getElementById('pokeSound');
const addTeamBtn = document.getElementById('teamAdd');
const teamList = document.getElementById('inTeam');
const moveSelects = [
  document.getElementById('m1'),
  document.getElementById('m2'),
  document.getElementById('m3'),
  document.getElementById('m4'),
];

let currentPokemon = null;
const populateMoves = moves => {
  moveSelects.forEach(select => {
    select.innerHTML = '';
    moves.forEach(move => {
      const option = document.createElement('option');
      option.value = move;
      option.textContent = move;
      select.appendChild(option);
    });
  });
};

const getSelectedMoves = () => moveSelects.map(select => select.value);
const addToTeam = (data, selectedMoves) => {
  const teamCard = document.createElement('div');
  teamCard.classList.add('pokeTeam');

  const img = document.createElement('img');
  img.src = getSprite(data);
  img.alt = data.name;

  const name = document.createElement('h3');
  name.textContent = data.name;

  const moveList = document.createElement('ul');
  selectedMoves.forEach(move => {
    const li = document.createElement('li');
    li.textContent = move;
    moveList.appendChild(li);

  });

  teamCard.appendChild(img);
  teamCard.appendChild(name);
  teamCard.appendChild(moveList);
  teamList.appendChild(teamCard);

  console.log("Added", data.name, "to your team with moveset:", selectedMoves);
};

searchBtn.addEventListener('click', () => {
  const name = input.value.trim();
  if (!name) return;

  fetchPokemon(name)
    .then(data => {
      currentPokemon = data;
      pokeImg.src = getSprite(data);
      pokeImg.alt = data.name;
      pokeName.textContent = data.name;
      pokeSound.src = getSound(data);
      populateMoves(getMoves(data));
      card.classList.remove('hidden');
    }, error => {
      alert("Could not find that Pokemon!");
      console.log("Error:", error.message);
    });
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchBtn.click();
});

addTeamBtn.addEventListener('click', () => {
  if (!currentPokemon) return;
  addToTeam(currentPokemon, getSelectedMoves());
  document.getElementById('pokeTeam').classList.remove('hidden');
});