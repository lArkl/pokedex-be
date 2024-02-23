import { Router } from 'express'
import { ResponseDto } from '../dto/Response.dto'
import { createUserSchema, signUserSchema, zParse } from '../validators'
import { signInUser, signUpUser, validateUser } from '../controllers/user.controller'

const router = Router()

router.post('/signin', async (req, res, next) => {
  try {
    const { body } = await zParse(signUserSchema, req)
    const user = await signInUser(body)
    const response: ResponseDto<typeof user> = { data: user, error: null }
    res.json(response)
  } catch (err) {
    next(err)
  }
})

router.get('/validate', async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      const user = await validateUser(token)
      const response: ResponseDto<typeof user> = { data: user, error: null }
      return res.json(response)
    }
    return res.status(400).json({ data: null, error: { message: 'Not authorized user' } })
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const params = await zParse(createUserSchema, req)
    const user = await signUpUser(params.body)
    const response: ResponseDto<typeof user> = { data: user, error: null }
    res.json(response)
  } catch (err) {
    next(err)
  }
})

export default router
