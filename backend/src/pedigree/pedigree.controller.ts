import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PedigreeService } from './pedigree.service';
import { CreatePedigreeDto, UpdatePedigreeDto, PedigreeQueryDto } from './dto';

@ApiTags('Pedigrees')
@Controller('pedigrees')
export class PedigreeController {
  constructor(private readonly pedigreeService: PedigreeService) {}

  @Post()
  @ApiOperation({ summary: '血統書データを作成' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '血統書データが正常に作成されました',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '無効なデータです',
  })
  create(@Body() createPedigreeDto: CreatePedigreeDto) {
    return this.pedigreeService.create(createPedigreeDto);
  }

  @Get('next-id')
  @ApiOperation({ summary: '次のPedigreeID（最新番号+1）を取得' })
  @ApiResponse({ status: HttpStatus.OK, description: '次のPedigreeID' })
  getNextPedigreeId() {
    return this.pedigreeService.getNextPedigreeId();
  }

  @Get('search/:pedigreeId')
  @ApiOperation({ summary: 'PedigreeIDで血統書データを検索' })
  @ApiResponse({ status: HttpStatus.OK, description: '血統書データ' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '血統書データが見つかりません',
  })
  @ApiParam({ name: 'pedigreeId', description: '血統書番号' })
  searchByPedigreeId(@Param('pedigreeId') pedigreeId: string) {
    return this.pedigreeService.findByPedigreeId(pedigreeId);
  }

  @Get()
  @ApiOperation({ summary: '血統書データを検索・一覧取得' })
  @ApiResponse({ status: HttpStatus.OK, description: '血統書データの一覧' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'ページ番号',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '1ページあたりの件数',
    example: 10,
  })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード' })
  @ApiQuery({ name: 'breedId', required: false, description: '品種ID' })
  @ApiQuery({ name: 'colorId', required: false, description: '毛色ID' })
  @ApiQuery({
    name: 'gender',
    required: false,
    description: '性別 (1: オス, 2: メス)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'ソート項目',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'ソート順',
    example: 'desc',
  })
  findAll(@Query() query: PedigreeQueryDto) {
    return this.pedigreeService.findAll(query);
  }

  @Get('pedigree-id/:pedigreeId')
  @ApiOperation({ summary: '血統書番号で血統書データを取得' })
  @ApiResponse({ status: HttpStatus.OK, description: '血統書データ' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '血統書データが見つかりません',
  })
  @ApiParam({ name: 'pedigreeId', description: '血統書番号' })
  findByPedigreeId(@Param('pedigreeId') pedigreeId: string) {
    return this.pedigreeService.findByPedigreeId(pedigreeId);
  }

  @Get('statistics')
  @ApiOperation({ summary: '血統書統計情報を取得' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '血統書統計情報',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', description: '総数' },
        recent: { type: 'number', description: '最近30日の新規登録数' },
        byBreed: { type: 'object', description: '猫種別統計' },
        byGender: { type: 'object', description: '性別統計' },
      },
    },
  })
  getStatistics() {
    return this.pedigreeService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'IDで血統書データを取得' })
  @ApiResponse({ status: HttpStatus.OK, description: '血統書データ' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '血統書データが見つかりません',
  })
  @ApiParam({ name: 'id', description: '血統書データのID' })
  findOne(@Param('id') id: string) {
    return this.pedigreeService.findOne(id);
  }

  @Get(':id/family-tree')
  @ApiOperation({ summary: '血統書の家系図を取得' })
  @ApiResponse({ status: HttpStatus.OK, description: '家系図データ' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '血統書データが見つかりません',
  })
  @Patch(':id')
  @ApiOperation({ summary: '血統書データを更新' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '血統書データが正常に更新されました',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '血統書データが見つかりません',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '無効なデータです',
  })
  @ApiParam({ name: 'id', description: '血統書データのID' })
  update(
    @Param('id') id: string,
    @Body() updatePedigreeDto: UpdatePedigreeDto,
  ) {
    return this.pedigreeService.update(id, updatePedigreeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '血統書データを削除' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '血統書データが正常に削除されました',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '血統書データが見つかりません',
  })
  @ApiParam({ name: 'id', description: '血統書データのID' })
  remove(@Param('id') id: string) {
    return this.pedigreeService.remove(id);
  }
}
