import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async findAll() {
    return this.offerRepository.find({
      relations: {
        item: true,
        user: true,
      },
    });
  }

  async findById(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: {
        item: true,
        user: true,
      },
    });
  }

  async create(user: User, dto: CreateOfferDto) {
    const wish = await this.wishesService.findById(dto.itemId);

    if (wish.raised + dto.amount > wish.price) {
      throw new BadRequestException('Сумма заявки больше, чем нужно');
    }
    if (user.id === wish.owner.id) {
      throw new BadRequestException('Нельзя скинуть на свой подарок');
    }

    await this.wishesService.update(wish.id, {
      raised: wish.raised + dto.amount,
    });

    const offer = this.offerRepository.create({
      user,
      ...dto,
      item: wish,
    });
    await this.offerRepository.save(offer);
    return {};
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
