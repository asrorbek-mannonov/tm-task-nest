import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import { IPageOptions, PageOptionsPipe } from '@/helpers/pagination'

export type ProductFilterOptions = IPageOptions & { category_id?: number }

@ApiTags('Products')
// @UseGuards(JwtAuthGuard)
@Controller('products')
// @ApiBearerAuth('access-token')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Create a product',
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @ApiOperation({
    summary: 'Get all products',
  })
  @Get('get-all')
  findAll() {
    return this.productsService.findAll()
  }

  @ApiOperation({
    summary: 'Get all products paginated',
  })
  @Get()
  paginate(@Query(new PageOptionsPipe()) options: ProductFilterOptions) {
    return this.productsService.paginate(options)
  }

  @ApiOperation({
    summary: 'Get the details of a product',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id)
  }

  @ApiOperation({
    summary: 'Update a product',
  })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto)
  }

  @ApiOperation({
    summary: 'Delete a product',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id)
  }
}
