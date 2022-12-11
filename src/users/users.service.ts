import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto'
import { IPageOptions, Page, PageMeta } from '../helpers/pagination'
import { users } from '@prisma/client'
import { ChangePasswordDto } from './dto/change-password.dto'
import { PrismaService } from '@/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto) {
    const password = await bcrypt.hash(data.password, 10)

    const user = this.prismaService.users.create({
      data: {
        ...data,
        password,
      },
    })

    return user
  }

  findOne(id: number) {
    return this.prismaService.users.findUnique({
      where: { id },
    })
  }

  getFullInfo(id: number) {
    return this.prismaService.users.findUnique({
      where: { id },
    })
  }

  findByUsername(username: string) {
    return this.prismaService.users.findUnique({
      where: { username },
    })
  }

  async paginate(options: IPageOptions) {
    const [count, users] = await this.prismaService.$transaction([
      this.prismaService.users.count(),
      this.prismaService.users.findMany({
        take: options.take,
        skip: 10 * (options.page - 1),
        orderBy: {
          [<keyof users>options.orderBy]: options.order,
        },
        where: {
          username: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
      }),
    ])
    const pageMeta = new PageMeta({ pageOptions: options, itemCount: count })
    const page = new Page(users, pageMeta)
    return page
  }

  findAll() {
    return this.prismaService.users.findMany({
      where: {
        status: true,
      },
    })
  }

  update(id: number, data: UpdateUserDto) {
    return this.prismaService.users.update({
      where: { id },
      data,
    })
  }

  async toggle(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
    })

    return await this.prismaService.users.update({
      where: { id },
      data: { status: !user.status },
    })
  }

  async changePassword(id: number, data: ChangePasswordDto) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
    })

    const isMatch = await bcrypt.compare(data.password, user.password)

    if (!isMatch) {
      throw new Error('Password is incorrect')
    }

    const newPassword = await bcrypt.hash(data.new_password, 10)

    return await this.prismaService.users.update({
      where: { id },
      data: {
        password: newPassword,
      },
    })
  }

  delete(id: number) {
    return this.prismaService.users.delete({
      where: { id },
    })
  }
}
