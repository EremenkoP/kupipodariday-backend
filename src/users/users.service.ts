import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findById(id: number): Promise<UserPublicProfileResponse> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Пользователь не найден');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    return this.userRepository.save(createdUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByName(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = this.findById(id);
    return `This action removes a #${id} user`;
  }

  async findMany({ query }) {
    const users = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    users.forEach((item) => delete item.password);
    return users;
  }
}
