import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthRequest } from '@/auth/auth.types'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import { IPageOptions, PageOptionsPipe } from '@/helpers/pagination'
import { ChangePasswordDto } from './dto/change-password.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@ApiBearerAuth('access-token')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  paginate(@Query(new PageOptionsPipe()) options: IPageOptions) {
    return this.usersService.paginate(options)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
  }

  @Get('get-all')
  findAll() {
    return this.usersService.findAll()
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Put(':id/toggle')
  toggle(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggle(id)
  }

  @Post('change-password')
  changePassword(@Request() req: AuthRequest, @Body() data: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.id, data)
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id)
  }
}
