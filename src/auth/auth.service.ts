import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { users } from '@prisma/client'
import { UsersService } from '@/users/users.service'
import * as bcrypt from 'bcrypt'
import { AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username)

    if (!user) {
      throw new BadRequestException("Login yoki parol noto'g'ri")
    }

    const isMatch = await bcrypt.compare(pass, user.password)

    if (!isMatch) {
      throw new BadRequestException("Login yoki parol noto'g'ri")
    }

    if (isMatch) {
      const { password: _, ...result } = user
      return result
    }

    return null
  }

  async login(user: Omit<users, 'password'>) {
    const payload = { sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  findAuthUser(user: AuthUser) {
    return this.usersService.findOne(user.id)
  }

  getProfile(user: AuthUser) {
    return this.usersService.getFullInfo(user.id)
  }
}
