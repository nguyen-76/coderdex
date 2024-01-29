const fs = require("fs");
const csv = require("csvtojson");
require("dotenv").config();
const mainUrl = process.env.MAIN_URL || "https://pokedex-api-fx8z.onrender.com";

const PokemonsData = async () => {
  let newData = await csv().fromFile("pokemon.csv");
  let data = JSON.parse(fs.readFileSync("db.json"));
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
      url: `${mainUrl}/pokemon_icons/images/${pokemon.Name}.png`,
    });
  });
  data.pokemons = pokemonsList;
  data.totalPokemons = data.pokemons.length;
  data = JSON.stringify(data);
  fs.writeFileSync("db.json", data);

  //
};
PokemonsData();
