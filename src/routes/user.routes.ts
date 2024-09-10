import { Router } from 'express'
import { ResponseDto } from '../dto/Response.dto'
import { createUserSchema, updateUserSchema, zParse } from '../validators'
import { getUserInfoById, signUpUser, updateUserProfile } from '../controllers/user.controller'
import { accessTokenMiddleware } from '../middlewares/auth'

const router = Router()

router.get('/', accessTokenMiddleware, async (req, res, next) => {
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

router.patch('/', accessTokenMiddleware, async (req, res, next) => {
  try {
    const { body } = await zParse(updateUserSchema, req)

    await updateUserProfile(req.userId ?? -1, body)

    const response: ResponseDto<{ message: string }> = {
      data: {
        message: 'Update successful',
      },
      error: null,
    }
    return res.json(response)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
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
