export interface PaginationDto<T> {
  items: T[]
  count: number
  page: number
  pageSize: number
}

export interface ResponseDto<T> {
  data: T
  error: null | { message: string; stack: unknown }
}

export type PaginatedResponseDto<T> = ResponseDto<PaginationDto<T>>

export type ListItemOutpuDto = {
  id: number
  name: string
}
