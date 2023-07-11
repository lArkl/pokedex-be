import express from 'express'
import 'reflect-metadata'
import cors from 'cors'
import pokemonRoutes from './routes/pokemon.routes'
import ErrorHandler from './middlewares/error.handler'

const app = express()

const PORT = 3000

app.listen(PORT)
console.log(`Server runing on port ${PORT}`)

app.use(cors())
app.use(pokemonRoutes)

app.use(ErrorHandler)
