import express from 'express'
import 'reflect-metadata'
import pokemonRoutes from './routes/pokemon.routes'

const app = express()

const PORT = 3000

app.listen(PORT)
console.log(`Server runing on port ${PORT}`)

app.use(pokemonRoutes)
