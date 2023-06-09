import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/helpers/response.dto';
import { ROLE } from 'src/helpers/role.enum';
import { Roles } from '../auth/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationDto } from './dto/pagination-dto';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(ROLE.SUPERADMIN)
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: PaginationDto): Promise<ResponseDto> {
    return this.userService.findAll(query);
  }

  @Put('edit/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<ResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(ROLE.SUPERADMIN)
  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto> {
    return this.userService.remove(id);
  }
}
