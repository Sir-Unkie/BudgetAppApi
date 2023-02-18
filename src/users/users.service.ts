import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DEFAULT_ROLE_ID } from './constants';
import { CreateUserDto } from './dto/create-User.dto';
import { UpdateUserDto } from './dto/update-User.dto';
import { UserRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UserRepository,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      salt,
      role: { id: DEFAULT_ROLE_ID },
    });

    try {
      const savedUser = await this.usersRepository.save(createdUser);

      const { password, salt, ...returnedUser } = savedUser;

      return returnedUser;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email already exists');
      } 

      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const allusers = await this.usersRepository.find(
      {
        relations: { role: true },
        select:
        {
          id: true,
          userEmail: true,
          role: { roleName: true },
          transactions: { amount: true },
        },
      });
    return allusers;
  }

  async findOne(id: number) {
    const foundUser = await this.usersRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    
    if (!foundUser) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return foundUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const res = await this.usersRepository.update({ id }, { ...updateUserDto });
    if (res.affected === 0) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    // TODO: add logic with BD
    return { id, ...updateUserDto };
  }

  async remove(id: number) {
    const res = await this.usersRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return `User removed`;
  }
}
