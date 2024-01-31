const fs = require("fs");
const csv = require("csvtojson");
require("dotenv").config();

const createPokemon = async () => {
  let newData = await csv().fromFile("pokemon.csv");
  let data = JSON.parse(fs.readFileSync("db.json"));
  newData = new Set(newData);
  newData = Array.from(newData);
  newData = newData.slice(0, 721);
  const pokemonsList = [];

  newData.forEach((pokemon, index) => {
    const type = [pokemon.Type1.toLowerCase()];
    if (!!pokemon.Type2) {
      type.push(pokemon.Type2.toLowerCase());
    }

    pokemonsList.push({
      id: index + 1,
      name: pokemon.Name,
      types: type,
      url: `http://localhost:8000/images/${index + 1}.png`,
    });
  });
  data.pokemons = pokemonsList;
  data.totalPokemons = data.pokemons.length;
  fs.writeFileSync("db.json", JSON.stringify(data));
};
createPokemon();
