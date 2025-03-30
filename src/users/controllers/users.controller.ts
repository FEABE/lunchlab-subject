import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  PaginatedUserResponseDto,
  UserResponseDto,
} from '../dto/user-response.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @Public()
  @ApiOperation({
    summary: '회원 가입',
    description: '새로운 사용자를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '회원가입 성공',
    type: UserResponseDto,
  })
  @ApiConflictResponse({
    description: '이미 존재하는 사용자명입니다.',
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    this.logger.debug(`Creating user: ${JSON.stringify(createUserDto)}`);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '사용자 목록 조회',
    description: '커서 기반 페이지네이션으로 사용자 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '사용자 목록 조회 성공',
    type: PaginatedUserResponseDto,
  })
  async findAll(@Query() params: PaginationDto) {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '특정 사용자 조회',
    description: 'ID로 특정 사용자를 조회합니다.',
  })
  @ApiOkResponse({
    description: '사용자 조회 성공',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없습니다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '특정 사용자의 정보를 수정합니다.',
  })
  @ApiOkResponse({
    description: '사용자 정보 수정 성공',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없습니다.',
  })
  @ApiConflictResponse({
    description: '수정하려는 사용자명이 이미 존재합니다.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '사용자 삭제',
    description: '특정 사용자를 삭제합니다.',
  })
  @ApiOkResponse({
    description: '사용자 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User with ID 1 has been deleted',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없습니다.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
