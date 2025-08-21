import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: '現在のページ番号' })
  page: number;

  @ApiProperty({ description: '1ページあたりの件数' })
  limit: number;

  @ApiProperty({ description: '総件数' })
  total: number;

  @ApiProperty({ description: '総ページ数' })
  totalPages: number;

  @ApiProperty({ description: '前のページがあるか' })
  hasPrevious: boolean;

  @ApiProperty({ description: '次のページがあるか' })
  hasNext: boolean;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
    this.hasPrevious = page > 1;
    this.hasNext = page < this.totalPages;
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'データ配列' })
  data: T[];

  @ApiProperty({ description: 'ページネーション情報', type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: T[], page: number, limit: number, total: number) {
    this.data = data;
    this.meta = new PaginationMetaDto(page, limit, total);
  }
}
