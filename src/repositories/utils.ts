export const getPaginationParams = (page: number, pageSize: number): { skip: number; take: number } => {
  return {
    take: pageSize,
    skip: (page - 1) * pageSize,
  }
}
