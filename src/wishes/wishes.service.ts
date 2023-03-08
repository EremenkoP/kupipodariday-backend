import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async findAll() {
    return this.wishRepository.find();
  }

  async create(user: User, createDto: CreateWishDto): Promise<Wish> {
    return this.wishRepository.save({
      owner: user,
      ...createDto,
    });
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      // чек лист 10
      take: 10,
      order: { copied: 'DESC' },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findById(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async removeById(id: number) {
    return this.wishRepository.delete({ id });
  }

  async update(id: number, updateDto: UpdateWishDto) {
    await this.wishRepository.update(
      { id },
      { ...updateDto, updatedAt: new Date() },
    );
    return {};
  }

  async findMany(item: FindManyOptions<Wish>) {
    return this.wishRepository.find(item);
  }

  async findWishes(id: number) {
    const wish = await this.wishRepository.find({
      relations: { owner: true },
      where: { owner: { id } },
    });
    return wish;
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishRepository.findOne(query);
  }
}
