const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) {
  // ein set ist wie ein array. duplikate verhindern
  const allGenres = new Set();

  // Alle filme aus dem Model holen
  const movies = Object.values(movieModel);

  // Durch jeden film gehen...
  for (const movie of movies) {
    // ...und durch jedes Genre des Films gehen
    for (const genre of movie.Genres) {
      allGenres.add(genre); // Genre zum Set hinzufügen
    }
  }

  // seet wieder in ein normales array umwandeln und alphabetisch sortieren
  const sortedGenres = Array.from(allGenres).sort();

  // die sortierte liste an das frontend zurückschicken
  res.send(sortedGenres);
});

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given,
   return only movies that have the given genre
 */
/* Task 1.4: Extend the GET /movies endpoint: ... */
app.get('/movies', function (req, res) {
  // alle filme aus dem objekt in ein array umwandeln
  let movies = Object.values(movieModel);

  // schauen ob ein genre in der URL angefragt wurde (req.query)
  const requestedGenre = req.query.genre;

  // wenn ein Genre angefragt wurde, liste filtern
  if (requestedGenre) {
    movies = movies.filter(function(movie) {
      // Behält den film nur wenn sein genres-array das gesuchte wort enthält
      return movie.Genres.includes(requestedGenre);
    });
  }

  // liste zurückschicken
  res.send(movies);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel

  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;

  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }

})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
