import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPublicProfileResponse } from './dto/userProfileResponse.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async removeById(id: number) {
    return await this.userRepository.delete({ id });
  }

  async findById(
    id: number,
    password = false,
  ): Promise<UserPublicProfileResponse> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect(password ? 'user.password' : '')
      .where('user.id = :id', { id })
      .getOne();
    return user;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<UserPublicProfileResponse> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    const { password, ...newUser } = await this.userRepository.save(
      createdUser,
    );
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByName(username: string, password = false) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect(password ? 'user.password' : '')
      .where('user.username = :username', { username })
      .getOne();
    return user;
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(query);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, email } = updateUserDto;
    // проверка на наличии в базе совпадений имени и почты
    const isExist = (await this.findOne({
      where: [{ email }, { username }],
    }))
      ? true
      : false;
    if (isExist) {
      console.log(2);
      throw new ConflictException(
        'Пользователь с таким email или username уже существует',
      );
    }
    // нахождение пользователя для изменения
    const user = await this.findById(id, true);
    if (!user) {
      console.log(1);
      throw new NotFoundException('Пользователь не найден');
    }
    // работа с паролем
    let password: string;
    if (updateUserDto.password) {
      password = await bcrypt.hash(updateUserDto.password, 10);
    } else {
      password = user.password;
    }

    return this.userRepository.update(id, {
      ...updateUserDto,
      password,
    });
  }

  async findMany({ query }) {
    const users = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    users.forEach((item) => delete item.password);
    return users;
  }
}
