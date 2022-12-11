import { Page, PageMeta } from '@/helpers/pagination'
import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { products } from '@prisma/client'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductFilterOptions } from './products.controller'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async paginate(options: ProductFilterOptions) {
    const category_id = +options.category_id || undefined

    const [count, users] = await this.prismaService.$transaction([
      this.prismaService.products.count({
        where: {
          category_id,
          OR: [
            {
              title: {
                contains: options.search,
                mode: 'insensitive',
              },
            },
            {
              category: {
                title: {
                  contains: options.search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
      }),
      this.prismaService.products.findMany({
        take: options.take,
        skip: options.take * (options.page - 1),
        orderBy: {
          [<keyof products>options.orderBy]: options.order,
        },
        include: {
          category: true,
        },
        where: {
          category_id,
          OR: [
            {
              title: {
                contains: options.search,
                mode: 'insensitive',
              },
            },
            {
              category: {
                title: {
                  contains: options.search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
      }),
    ])
    const pageMeta = new PageMeta({ pageOptions: options, itemCount: count })
    const page = new Page(users, pageMeta)
    return page
  }

  create(createProductDto: CreateProductDto) {
    return this.prismaService.products.create({
      data: createProductDto,
    })
  }

  findAll() {
    return this.prismaService.products.findMany({
      include: {
        category: true,
      },
    })
  }

  findOne(id: number) {
    return this.prismaService.products.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prismaService.products.update({
      where: {
        id,
      },
      data: updateProductDto,
      include: {
        category: true,
      },
    })
  }

  remove(id: number) {
    return this.prismaService.products.delete({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })
  }
}
