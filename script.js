const pokeApiUrl = "https://pokeapi.co/api/v2/pokemon";
const limit = 50;
let currentPage = 1;
let allPokemons = []; // Armazena todos os Pokémon carregados

async function fetchPokemons(page) {
  const offset = (page - 1) * limit;
  const response = await fetch(`${pokeApiUrl}?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  const pokemons = data.results;

  allPokemons = []; // Limpa a lista anterior
  const pokemonList = document.getElementById("pokemonList");
  pokemonList.innerHTML = ""; // Limpa a lista antes de adicionar novos cards

  for (const pokemon of pokemons) {
    const pokemonData = await fetchPokemonDetails(pokemon.url);
    allPokemons.push(pokemonData); // Adiciona Pokémon ao array
    const card = createPokemonCard(pokemonData);
    pokemonList.appendChild(card);
  }

  updatePaginationInfo(page);
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return response.json();
}

function createPokemonCard(data) {
  const card = document.createElement("div");
  card.className = "pokemon-card";

  const types = data.types
    .map((typeInfo) => {
      return `<span class="type type-${typeInfo.type.name}">${typeInfo.type.name}</span>`;
    })
    .join(" ");

  card.innerHTML = `
        <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)} (#${
    data.id
  })</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Altura: ${data.height / 10} m</p>
        <p>Tipos: ${types}</p>
    `;

  return card;
}

function updatePaginationInfo(page) {
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.innerText = `Página ${page}`;
}

// Eventos para navegação
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchPokemons(currentPage);
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentPage++;
  fetchPokemons(currentPage);
});

// Evento de pesquisa
document.getElementById("searchInput").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.includes(query)
  );

  const pokemonList = document.getElementById("pokemonList");
  pokemonList.innerHTML = ""; // Limpa a lista antes de adicionar novos cards

  filteredPokemons.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    pokemonList.appendChild(card);
  });
});

// Inicializa a Pokédex na página 1
fetchPokemons(currentPage);
