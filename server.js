const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moviesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()
app.use(bodyParser.json())

// Define the movie schema and model
const movieSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String,
})

const Movie = mongoose.model('Movie', movieSchema)

// CRUD Routes

// Create a new movie
app.post('/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body)
    await movie.save()
    res.status(201).send(movie)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Read all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find()
    res.send(movies)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Read a specific movie by ID
app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send()
    res.send(movie)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Update a movie by ID
app.put('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!movie) return res.status(404).send()
    res.send(movie)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Delete a movie by ID
app.delete('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send()
    res.send(movie)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
