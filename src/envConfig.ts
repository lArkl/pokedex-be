import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  ACCESS_TOKEN_PRIVATE_KEY: z.string().min(1),
  ACCESS_TOKEN_PUBLIC_KEY: z.string().min(1),
  REFRESH_TOKEN_PRIVATE_KEY: z.string().min(1),
  REFRESH_TOKEN_PUBLIC_KEY: z.string().min(1),
  ACCESS_TOKEN_EXPIRATION: z.coerce.number().min(20),
  REFRESH_TOKEN_EXPIRATION: z.coerce.number().min(60),
  SALT_ROUNDS: z.coerce.number().default(12),
  CLIENT_URL: z.string().min(1),
})

const env = envSchema.parse(process.env)

export default env
