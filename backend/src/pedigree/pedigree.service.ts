import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/cache';
import { CreatePedigreeDto, UpdatePedigreeDto, PedigreeQueryDto } from './dto';

@Injectable()
export class PedigreeService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async getNextPedigreeId(): Promise<{ nextPedigreeId: string }> {
    // 最新のPedigreeIDを取得
    const latestPedigree = await this.prisma.pedigree.findFirst({
      orderBy: {
        pedigreeId: 'desc',
      },
      select: {
        pedigreeId: true,
      },
    });

    let nextId = 'JCU0000001'; // デフォルト開始番号

    if (latestPedigree) {
      // PedigreeIDから番号部分を抽出（例: JCU0000123 → 123）
      const match = latestPedigree.pedigreeId.match(/(\d+)$/);
      if (match) {
        const currentNumber = parseInt(match[1]);
        const nextNumber = currentNumber + 1;
        // ゼロパディングして新しいIDを生成
        const paddedNumber = nextNumber.toString().padStart(7, '0');
        nextId = `JCU${paddedNumber}`;
      }
    }

    return { nextPedigreeId: nextId };
  }

  async findByPedigreeId(pedigreeId: string) {
    const pedigree = await this.prisma.pedigree.findUnique({
      where: { pedigreeId },
    });

    if (!pedigree) {
      throw new NotFoundException(`PedigreeID ${pedigreeId} が見つかりません`);
    }

    return pedigree;
  }

  async create(createPedigreeDto: CreatePedigreeDto) {
    // 設計書に準拠したデータ準備
    const createData: any = {
      pedigreeId: createPedigreeDto.pedigreeId,
      title: createPedigreeDto.title,
      catName: createPedigreeDto.catName,
      catName2: createPedigreeDto.catName2,
      breedCode: createPedigreeDto.breedCode,
      genderCode: createPedigreeDto.genderCode, // 設計書に合わせて変更
      eyeColor: createPedigreeDto.eyeColor,
      coatColorCode: createPedigreeDto.coatColorCode,
      birthDate: createPedigreeDto.birthDate, // 設計書に合わせてString型のまま
      breederName: createPedigreeDto.breederName,
      ownerName: createPedigreeDto.ownerName,
      registrationDate: createPedigreeDto.registrationDate, // 設計書に合わせてString型のまま
      brotherCount: createPedigreeDto.brotherCount,
      sisterCount: createPedigreeDto.sisterCount,
      notes: createPedigreeDto.notes,
      notes2: createPedigreeDto.notes2,
      otherNo: createPedigreeDto.otherNo,
      // 父猫情報（設計書準拠）
      fatherTitle: createPedigreeDto.fatherTitle,
      fatherCatName: createPedigreeDto.fatherCatName, // 設計書で必要
      fatherCatName2: createPedigreeDto.fatherCatName2,
      fatherCoatColor: createPedigreeDto.fatherCoatColor,
      fatherEyeColor: createPedigreeDto.fatherEyeColor,
      fatherJCU: createPedigreeDto.fatherJCU,
      fatherOtherCode: createPedigreeDto.fatherOtherCode,
      // 母猫情報（設計書準拠）
      motherTitle: createPedigreeDto.motherTitle,
      motherCatName: createPedigreeDto.motherCatName, // 設計書で必要
      motherCatName2: createPedigreeDto.motherCatName2,
      motherCoatColor: createPedigreeDto.motherCoatColor,
      motherEyeColor: createPedigreeDto.motherEyeColor,
      motherJCU: createPedigreeDto.motherJCU,
      motherOtherCode: createPedigreeDto.motherOtherCode,

      // 祖父母情報（父方祖父母）
      ffTitle: createPedigreeDto.ffTitle,
      ffCatName: createPedigreeDto.ffCatName,
      ffCatColor: createPedigreeDto.ffCatColor,
      ffJCU: createPedigreeDto.ffJCU,

      fmTitle: createPedigreeDto.fmTitle,
      fmCatName: createPedigreeDto.fmCatName,
      fmCatColor: createPedigreeDto.fmCatColor,
      fmJCU: createPedigreeDto.fmJCU,

      // 祖父母情報（母方祖父母）
      mfTitle: createPedigreeDto.mfTitle,
      mfCatName: createPedigreeDto.mfCatName,
      mfCatColor: createPedigreeDto.mfCatColor,
      mfJCU: createPedigreeDto.mfJCU,

      mmTitle: createPedigreeDto.mmTitle,
      mmCatName: createPedigreeDto.mmCatName,
      mmCatColor: createPedigreeDto.mmCatColor,
      mmJCU: createPedigreeDto.mmJCU,

      oldCode: createPedigreeDto.oldCode,
      catId: createPedigreeDto.catId,
    };

    // undefined フィールドを除去
    Object.keys(createData).forEach(key => {
      if (createData[key] === undefined) {
        delete createData[key];
      }
    });

    const result = await this.prisma.pedigree.create({
      data: createData,
      include: {
        breed: true,
        color: true,
        genderList: true, // 設計書に合わせて変更
        cat: true,
      },
    });

    // キャッシュを無効化
    await this.cacheService.deletePattern('pedigree:statistics');

    return result;
  }

  async findAll(query: PedigreeQueryDto) {
    const {
      page = 1,
      limit = 20, // デフォルト値を20に増加
      search,
      genderCode,
      catName2,
      eyeColor,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // ページネーション制限
    const maxLimit = 100;
    const safeLimit = Math.min(limit, maxLimit);
    const skip = (page - 1) * safeLimit;
    const where: any = {};

    // 検索機能（インデックス最適化のため、必要なフィールドのみ）
    if (search) {
      where.OR = [
        { catName: { contains: search, mode: 'insensitive' } },
        { pedigreeId: { contains: search, mode: 'insensitive' } },
        { breederName: { contains: search, mode: 'insensitive' } },
        { ownerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // フィルター
    if (genderCode) where.genderCode = parseInt(genderCode);
    if (eyeColor) where.eyeColor = { contains: eyeColor, mode: 'insensitive' };
    if (catName2) where.catName2 = { contains: catName2, mode: 'insensitive' };

    // パフォーマンス最適化：必要なフィールドのみ選択
    const [data, total] = await Promise.all([
      this.prisma.pedigree.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          pedigreeId: true,
          title: true,
          catName: true,
          catName2: true,
          genderCode: true,
          eyeColor: true,
          birthDate: true,
          breederName: true,
          ownerName: true,
          createdAt: true,
          updatedAt: true,
          // リレーション情報（必要最小限）
          breed: {
            select: {
              id: true,
              name: true,
            },
          },
          color: {
            select: {
              id: true,
              name: true,
            },
          },
          genderList: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.pedigree.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        hasNext: total > page * safeLimit,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const pedigree = await this.prisma.pedigree.findUnique({
      where: { id },
      include: {
        breed: true,
        color: true,
        genderList: true, // 設計書に合わせて変更
        cat: true,
      },
    });

    if (!pedigree) {
      throw new NotFoundException(`血統書 ID ${id} が見つかりません`);
    }

    return pedigree;
  }

  async update(id: string, updatePedigreeDto: UpdatePedigreeDto) {
    await this.findOne(id); // 存在確認

    // 設計書に準拠したデータ準備
    const updateData: any = {
      ...updatePedigreeDto,
      genderCode: updatePedigreeDto.genderCode, // 設計書に合わせて変更
    };

    // undefined フィールドを除去
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const result = await this.prisma.pedigree.update({
      where: { id },
      data: updateData,
      include: {
        breed: true,
        color: true,
        genderList: true, // 設計書に合わせて変更
        cat: true,
      },
    });

    // キャッシュを無効化
    await this.cacheService.deletePattern('pedigree:statistics');

    return result;
  }

  async remove(id: string) {
    await this.findOne(id); // 存在確認

    const result = await this.prisma.pedigree.delete({
      where: { id },
    });

    // キャッシュを無効化
    await this.cacheService.deletePattern('pedigree:statistics');

    return result;
  }

  // 血統書統計情報の取得（設計書準拠）
  async getStatistics() {
    const cacheKey = 'pedigree:statistics';

    // キャッシュから取得を試行（5分キャッシュ）
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const [totalCount, breedStats, genderStats, recentCount] =
      await Promise.all([
        this.prisma.pedigree.count(),
        this.prisma.pedigree.groupBy({
          by: ['breedCode'],
          _count: true,
          where: { breedCode: { not: null } },
        }),
        this.prisma.pedigree.groupBy({
          by: ['genderCode'], // 設計書に合わせて変更
          _count: true,
          where: { genderCode: { not: null } },
        }),
        this.prisma.pedigree.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 過去30日
            },
          },
        }),
      ]);

    const statistics = {
      total: totalCount,
      recent: recentCount,
      byBreed: breedStats.reduce((acc, stat) => {
        acc[stat.breedCode || 'unknown'] = stat._count;
        return acc;
      }, {}),
      byGender: genderStats.reduce((acc, stat) => {
        acc[stat.genderCode || 'unknown'] = stat._count;
        return acc;
      }, {}),
    };

    // キャッシュに保存（5分間）
    await this.cacheService.set(cacheKey, statistics, 300);

    return statistics;
  }
}
