import { ErrorRequestHandler } from 'express'
import { ResponseDto } from '../dto/Response.dto'

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 500

  const errMsg = err.message || 'Something went wrong'

  const response: ResponseDto<null> = {
    data: null,
    error: {
      message: errMsg,
      stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    },
  }
  return res.status(errStatus).json(response)
}

export default ErrorHandler
