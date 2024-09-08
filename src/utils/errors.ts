class GeneralError extends Error {
  statusCode: number
  constructor(msg: string) {
    super(msg)
  }
}

export class AuthTokenError extends GeneralError {
  constructor(msg: string) {
    super(msg)
    this.name = 'AuthTokenError'
    this.statusCode = 401
  }
}

export class RefreshTokenError extends GeneralError {
  constructor(msg: string) {
    super(msg)
    this.name = 'RefreshTokenError'
    this.statusCode = 400
  }
}

export class AuthUserError extends GeneralError {
  constructor(msg: string) {
    super(msg)
    this.name = 'AuthUserError'
    this.statusCode = 400
  }
}
