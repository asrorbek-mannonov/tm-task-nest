import { users } from '@prisma/client'

type With<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type AuthUser = With<users, 'id'>
export interface AuthRequest extends Request {
  user: AuthUser
}
