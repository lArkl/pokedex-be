import express from 'express'
import 'reflect-metadata'
import cors from 'cors'
import { pokemonRoutes, userRoutes } from './routes'
import ErrorHandler from './middlewares/error.handler'

const app = express()

const PORT = 4000

app.listen(PORT)
console.log(`Server runing on port ${PORT}`)

app.use(cors())
app.use(express.json())
app.use(pokemonRoutes)
app.use('/users', userRoutes)

app.use(ErrorHandler)
