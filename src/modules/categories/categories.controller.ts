import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Put, Query, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryApiResponseDto } from 'src/modules/categories/dto/category-response.dto';
import { ROUTES } from 'src/constants/routes.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesQueryParams } from 'src/modules/categories/types/category.query-params';

@ApiTags(ROUTES.CATEGORIES)
@Controller(ROUTES.CATEGORIES)
@UseGuards(JwtAuthGuard)
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	@ApiOperation({ summary: 'Create category' })
	@UsePipes(ValidationPipe)
	create(
		@Body() createCategoryDto: CreateCategoryDto,
		@GetUser() user: User,
	): Promise<CategoryApiResponseDto> {
		return this.categoriesService.create(createCategoryDto, user);
	}

	@Get()
	@ApiOperation({ summary: 'Get categories' })
	findAll(
		@GetUser() user: User,
		@Query() filters?: CategoriesQueryParams,
	): Promise<CategoryApiResponseDto[]> {
		return this.categoriesService.findAll(user, filters);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get category by ID' })
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<CategoryApiResponseDto> {
		return this.categoriesService.findOne(id, user);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update category by ID' })
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@GetUser() user: User,
	) {
		return this.categoriesService.update(id, user, updateCategoryDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete category by ID' })
	remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
		return this.categoriesService.remove(id, user);
	}
}
