import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
  @ApiProperty()
  password: string

  @ApiProperty()
  new_password: string
}
