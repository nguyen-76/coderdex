var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get("/", function (req, res, next) {
  const { body, params, url, query } = req;
  const allowedFilter = ["search", "type", "page", "limit"];
  try {
    let { page, limit, type, search, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 15;
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed!`);
        exception.statusCode = 401;
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });
    let offset = limit * (page - 1);

    let db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const { pokemons } = db;

    let result = [];
    if (type) {
      result = pokemons.filter((pokemon) => {
        return pokemon.types.includes(type);
      });
    } else result = pokemons;

    if (search) {
      result = pokemons.filter((pokemon) => pokemon.name.includes(search));
    }
    result = result.slice(offset, offset + limit);
    const response = {
      success: true,
      data: result,
    };
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:pokemonId", function (req, res, next) {
  try {
    const pokemonId = Number(req.params.pokemonId);

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const { pokemons } = db;
    let result = [];
    const targetIndex = pokemons.findIndex(
      (pokemon) => pokemon.id === pokemonId
    );
    if (targetIndex === 0) {
      result.push(pokemons[pokemons.length - 1]);
      result.push(pokemons[0]);
      result.push(pokemons[1]);
    } else if (targetIndex === pokemons.length - 1) {
      result.push(pokemons[pokemons.length - 2]);
      result.push(pokemons[pokemons.length - 1]);
      result.push(pokemons[0]);
    } else {
      result.push(pokemons[targetIndex - 1]);
      result.push(pokemons[targetIndex]);
      result.push(pokemons[targetIndex + 1]);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  const { body, params, url, query } = req;
  let db = JSON.parse(fs.readFileSync("db.json"));
  try {
    if (!body.name || !body.id || !body.types) {
      const exception = new Error(`Missing required data.`);
      exception.statusCode = 401;
      throw exception;
    }
    if (body.types.length > 2) {
      const exception = new Error("Pokémon can only have one or two types.");
      exception.statusCode = 401;
      throw exception;
    }
    body.types.forEach((type) => {
      if (!db.types.includes(type)) {
        const exception = new Error("Pokémon's type is invalid.");
        exception.statusCode = 401;
        throw exception;
      }
    });
    db.pokemons.forEach((pokemon) => {
      if (
        pokemon.id === parseInt(body.id) ||
        pokemon.name === body.name.toLowerCase()
      ) {
        const exception = new Error("The Pokémon already exists.");
        exception.statusCode = 401;
        throw exception;
      }
    });

    const newPokemon = {
      id: parseInt(body.id),
      name: body.name.toLowerCase(),
      types: body.types,
      url: body.url ? body.url : "",
    };
    db.pokemons.push(newPokemon);
    fs.writeFileSync("db.json", JSON.stringify(db));
    const response = {
      success: true,
      data: newPokemon,
    };
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
