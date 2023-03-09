import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, createDto: CreateWishlistDto) {
    const items = await this.wishesService.findMany({
      where: { id: In(createDto.itemsId) },
    });

    delete createDto.itemsId;
    const list = await this.wishlistRepository.save({
      owner: {
        id: user.id,
        username: user.username,
        about: user.about,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      items,
      ...createDto,
    });
    return list;
  }

  async findAll() {
    return this.wishlistRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
  }

  async update(id: number, updateDto: UpdateWishlistDto) {
    const items = await this.wishesService.findMany({
      where: { id: In(updateDto.itemsId) },
    });
    delete updateDto.itemsId;
    return this.wishlistRepository.save({
      id,
      items,
      ...updateDto,
    });
  }

  async removeById(id: number) {
    const { affected } = await this.wishlistRepository.delete({ id });
    if (affected === 1) {
      return this.findAll();
    } else {
      throw new ConflictException('При удалении что то пошло не так...');
    }
  }
}
