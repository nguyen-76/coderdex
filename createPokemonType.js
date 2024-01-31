const fs = require("fs");
const csv = require("csvtojson");
require("dotenv").config();

const createPokemonType = async () => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  const pokemonTypes = [
    "bug",
    "dragon",
    "fairy",
    "fire",
    "ghost",
    "ground",
    "normal",
    "psychic",
    "steel",
    "dark",
    "electric",
    "fighting",
    "flyingText",
    "grass",
    "ice",
    "poison",
    "rock",
    "water",
  ];
  data.types = pokemonTypes;
  fs.writeFileSync("db.json", JSON.stringify(data));
};
createPokemonType();
