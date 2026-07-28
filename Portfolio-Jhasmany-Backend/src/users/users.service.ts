import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto | Partial<User>): Promise<User> {
    const password = createUserDto.password
      ? await this.normalizePassword(createUserDto.password)
      : createUserDto.password;
    const user = this.usersRepository.create({
      ...createUserDto,
      password,
    });
    const savedUser = await this.usersRepository.save(user);
    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'id',
        'email',
        'name',
        'role',
        'isActive',
        'authProvider',
        'googleId',
        'avatarUrl',
        'emailVerified',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'name',
        'role',
        'isActive',
        'authProvider',
        'googleId',
        'avatarUrl',
        'emailVerified',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData = {
      ...updateUserDto,
      password: updateUserDto.password
        ? await this.normalizePassword(updateUserDto.password)
        : updateUserDto.password,
    };

    if (!updateData.password) {
      delete updateData.password;
    }

    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const result = await this.usersRepository.update(id, {
      password: hashedPassword,
      authProvider: 'email',
    });
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  private async normalizePassword(password: string): Promise<string> {
    if (password.startsWith('$2a$') || password.startsWith('$2b$')) {
      return password;
    }

    return bcrypt.hash(password, 10);
  }

  async linkGoogleAccount(id: string, googleId: string, avatarUrl?: string): Promise<User> {
    await this.usersRepository.update(id, {
      googleId,
      avatarUrl,
      emailVerified: true,
      authProvider: 'google',
    });
    return this.findOne(id);
  }
}
