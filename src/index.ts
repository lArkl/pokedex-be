import express from 'express'
import 'reflect-metadata'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authRoutes, pokemonRoutes, userRoutes } from './routes'
import ErrorHandler from './middlewares/error.handler'
import envConfig from './envConfig'

const app = express()
app.listen(envConfig.PORT)
console.log(`Server runing on port ${envConfig.PORT}`)

app.use(cookieParser())
app.use(cors({ credentials: true, origin: envConfig.CLIENT_URL }))
app.use(express.json())
app.use(pokemonRoutes)
app.use('/users', userRoutes)
app.use('/auth', authRoutes)

app.use(ErrorHandler)
