import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.categories.create({ data: createCategoryDto })
  }

  findAll() {
    return this.prismaService.categories.findMany()
  }

  findOne(id: number) {
    return this.prismaService.categories.findUnique({
      where: { id },
    })
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prismaService.categories.update({
      where: { id },
      data: updateCategoryDto,
    })
  }

  remove(id: number) {
    return this.prismaService.categories.delete({ where: { id } })
  }
}
