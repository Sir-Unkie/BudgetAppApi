import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Put, Query, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
	ICategoriesFilters,
	ICategoryApiResponse,
} from 'src/modules/categories/types/index.tsx';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	@UsePipes(ValidationPipe)
	create(
		@Body() createCategoryDto: CreateCategoryDto,
		@GetUser() user: User,
	): Promise<ICategoryApiResponse> {
		return this.categoriesService.create(createCategoryDto, user);
	}

	@Get()
	findAll(
		@GetUser() user: User,
		@Query() filters?: ICategoriesFilters,
	): Promise<ICategoryApiResponse[]> {
		return this.categoriesService.findAll(user, filters);
	}

	@Get(':id')
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<ICategoryApiResponse> {
		return this.categoriesService.findOne(id, user);
	}

	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@GetUser() user: User,
	) {
		return this.categoriesService.update(id, user, updateCategoryDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
		return this.categoriesService.remove(id, user);
	}
}
