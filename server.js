require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');

const app = express();
app.use(morgan('dev'));


const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, 
  `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, 
  `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  console.log('validate bearer token middleware');
  
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next();
});

function handleGetTypes(req, res) {
  res.send(validTypes);
}

app.get('/types', handleGetTypes);


function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;
  const { name, type } = req.query;

  // filter our pokemon by name if name query param is present
  if (name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  if (type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(type)
    )
  }

  res.json(response)
  
}

app.get('/pokemon', handleGetPokemon);


const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});
