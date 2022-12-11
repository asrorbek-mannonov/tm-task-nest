import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'user' })
  username: string

  @ApiProperty({ example: 'password' })
  password: string
}
