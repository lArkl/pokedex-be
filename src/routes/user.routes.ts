import { Router } from 'express'
import { ResponseDto } from '../dto/Response.dto'
import { createUserSchema, zParse } from '../validators'
import { getUserInfoById, signUpUser } from '../controllers/user.controller'
import { accessTokenMiddleware } from '../middlewares/auth'

const router = Router()

router.get('/info', accessTokenMiddleware, async (req, res, next) => {
  try {
    const user = await getUserInfoById(req.userId ?? 0)

    const response: ResponseDto<{ firstname: string; lastname: string; email: string; expiration: string }> = {
      data: { ...user, expiration: req.expiration ?? '' },
      error: null,
    }
    return res.json(response)
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
