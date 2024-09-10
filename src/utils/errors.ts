class GeneralError extends Error {
  statusCode = 400
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
  }
}

export class AuthUserError extends GeneralError {
  constructor(msg: string) {
    super(msg)
    this.name = 'AuthUserError'
  }
}
