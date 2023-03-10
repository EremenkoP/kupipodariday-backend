import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UserPublicProfileResponse } from './dto/userProfileResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  // CRUD из Swagger
  @Get('me')
  async me(@Req() req) {
    return await this.usersService.findById(req.user.id);
  }

  @Patch('me')
  async updateMe(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublicProfileResponse> {
    await this.usersService.update(req.user.id, updateUserDto);
    const user = await this.usersService.findByName(req.user.username);

    if (!user) throw new NotFoundException('Пользователь не найден');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, password, ...result } = user;
    return result;
  }

  @Get('me/wishes')
  async findWishesId(@Req() req) {
    return await this.wishesService.findWishes(req.user.id);
  }

  @Get(':username')
  async findUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByName(username);

    if (!user) throw new NotFoundException('Пользователь не найден');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  @Get(':username/wishes')
  async findWishesName(@Param('username') username: string) {
    const user = await this.usersService.findByName(username);
    if (!user) throw new NotFoundException();
    return await this.wishesService.findWishes(user.id);
  }

  @Post('find')
  async findMany(@Body() user) {
    return this.usersService.findMany(user);
  }

  // CRUD из ТЗ
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateUserDto);

    if (result) {
      return await this.usersService.findById(+id);
    } else {
      throw new NotFoundException();
    }
  }
}
