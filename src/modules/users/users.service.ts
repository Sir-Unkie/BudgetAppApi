import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserApiResponse } from 'src/modules/users/types/userResponse.type';
import { DEFAULT_ROLE_ID } from './constants';
import { CreateUserDto } from './dto/create-User.dto';
import { UpdateUserDto } from './dto/update-User.dto';
import { UserRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
	constructor(private usersRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto): Promise<IUserApiResponse> {
		try {
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

			const createdUser = this.usersRepository.create({
				...createUserDto,
				password: hashedPassword,
				salt,
				role: { id: DEFAULT_ROLE_ID },
			});

			const savedUser = await this.usersRepository.save(createdUser);

			return {
				displayName: savedUser.displayName,
				id: savedUser.id,
				role: savedUser.role.roleName,
				userEmail: savedUser.userEmail,
			};
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('User with this email already exists');
			}

			throw new InternalServerErrorException();
		}
	}

	async findAll(): Promise<IUserApiResponse[]> {
		try {
			const allusers = await this.usersRepository.find({
				relations: { role: true },
				select: {
					id: true,
					userEmail: true,
					role: { roleName: true },
					displayName: true,
				},
			});

			const response: IUserApiResponse[] = allusers.map(user => ({
				...user,
				role: user.role.roleName,
			}));

			return response;
		} catch (err) {
			throw err;
		}
	}

	async findOne(id: number): Promise<IUserApiResponse> {
		try {
			const foundUser = await this.usersRepository.findOne({
				where: { id },
				relations: { role: true },
			});

			if (!foundUser) {
				throw new NotFoundException(`User with ID=${id} not found`);
			}

			const response: IUserApiResponse = {
				id: foundUser.id,
				role: foundUser.role.roleName,
				userEmail: foundUser.userEmail,
				displayName: foundUser.displayName,
			};

			return response;
		} catch (err) {
			throw err;
		}
	}

	async update(
		id: number,
		updateUserDto: UpdateUserDto,
	): Promise<IUserApiResponse> {
		try {
			const [res, foundUser] = await Promise.all([
				this.usersRepository.update({ id }, { ...updateUserDto }),
				this.usersRepository.findOne({
					where: { id },
					relations: { role: true },
				}),
			]);

			if (res.affected === 0 || !foundUser) {
				throw new NotFoundException(`User with ID=${id} not found`);
			}

			return {
				id,
				userEmail: updateUserDto.userEmail,
				displayName: updateUserDto.displayName ?? null,
				role: foundUser.role.roleName,
			};
		} catch (err) {
			throw err;
		}
	}

	async remove(id: number) {
		try {
			const res = await this.usersRepository.delete(id);

			if (res.affected === 0) {
				throw new NotFoundException(`User with ID=${id} not found`);
			}

			return `User removed`;
		} catch (err) {
			throw err;
		}
	}
}