import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('top')
  async findTop(): Promise<Wish[]> {
    const users = await this.wishesService.findTop();
    users.forEach((item) => {
      delete item.owner.password;
      delete item.owner.email;
    });
    return users;
  }

  @Get('last')
  async findLast(): Promise<Wish[]> {
    const users = await this.wishesService.findLast();
    users.forEach((item) => {
      delete item.owner.password;
      delete item.owner.email;
    });
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() wishDto: CreateWishDto): Promise<Wish> {
    return this.wishesService.create(req.user, wishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findById(id);
    if (req.user.id !== wish.owner.id) {
      throw new NotFoundException('У вас нет прав');
    }
    return this.wishesService.update(id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const wish = await this.wishesService.findById(id);
    if (wish.offers.length) {
      throw new BadRequestException(
        'Сумма сбора больше 0, этот подарок нельзя удалить!',
      );
    }
    if (req.user.id !== wish.owner.id) {
      throw new NotFoundException('У вас нет прав');
    }
    await this.wishesService.removeById(id);

    delete wish.owner.password;
    delete wish.owner.email;
    return wish;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const wish = await this.wishesService.findById(id);
    const { name, link, price, owner } = wish;
    const isExist = (await this.wishesService.findOne({
      where: {
        name,
        link,
        price,
        owner: { id: owner.id },
      },
      relations: { owner: true },
    }))
      ? true
      : false;
    if (isExist) {
      throw new ForbiddenException('Вы уже копировали себе этот подарок');
    }

    if (req.user.id !== wish.owner.id) {
      throw new NotFoundException('У вас нет прав');
    }
    const copyWish = {
      name: wish.name,
      image: wish.image,
      link: wish.link,
      price: wish.price,
      description: wish.description,
    };
    await this.wishesService.create(req.user, copyWish);
    await this.wishesService.update(wish.id, { copied: wish.copied++ });

    // if (wish.copied > 0) {
    //   throw new NotFoundException('Вы уже копировали');
    // }
    return {};
  }
}
