import { ErrorRequestHandler } from 'express'
import { ResponseDto } from '../dto/Response.dto'

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 500

  const errMsg = err.message ?? 'Something went wrong'
  const errorName = err.name ?? 'General'

  const response: ResponseDto<null> = {
    data: null,
    error: {
      message: errMsg,
      name: errorName,
      stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    },
  }
  return res.status(errStatus).json(response)
}

export default ErrorHandler
