import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-User.dto';
import { UpdateUserDto } from './dto/update-User.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) { }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const createdUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      salt,
    });

    try {
      await createdUser.save();
      // TODO: consider removing returns of data cause PW are there
      return createdUser;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('User with this username already exists');
      } 

      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const allusers = await this.usersRepository.find();
    return allusers;
  }

  async findOne(id: number) {
    const foundUser = await this.usersRepository.findOneBy({ id });
    
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
