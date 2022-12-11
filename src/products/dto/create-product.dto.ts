import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsNumber()
  category_id: number

  @ApiProperty()
  image: string

  @ApiProperty()
  rate: number

  @ApiProperty()
  count: number
}
