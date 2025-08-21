import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedigreeDto, UpdatePedigreeDto, PedigreeQueryDto } from './dto';

@Injectable()
export class PedigreeService {
  constructor(private prisma: PrismaService) {}

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
      oldCode: createPedigreeDto.oldCode,
      catId: createPedigreeDto.catId,
    };

    // undefined フィールドを除去
    Object.keys(createData).forEach(key => {
      if (createData[key] === undefined) {
        delete createData[key];
      }
    });

    return this.prisma.pedigree.create({
      data: createData,
      include: {
        breed: true,
        color: true,
        genderList: true, // 設計書に合わせて変更
        cat: true,
      },
    });
  }

  async findAll(query: PedigreeQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      genderCode,
      catName2,
      eyeColor,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search functionality
    if (search) {
      where.OR = [
        { catName: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { breederName: { contains: search, mode: 'insensitive' } },
        { ownerName: { contains: search, mode: 'insensitive' } },
        { fatherCatName: { contains: search, mode: 'insensitive' } }, // 設計書準拠
        { motherCatName: { contains: search, mode: 'insensitive' } }, // 設計書準拠
      ];
    }

    // Filters（設計書に合わせて変更）
    if (genderCode) where.genderCode = parseInt(genderCode); // 性別コード変換
    if (eyeColor) where.eyeColor = { contains: eyeColor, mode: 'insensitive' };
    if (catName2) where.catName2 = { contains: catName2, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.pedigree.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          breed: true,
          color: true,
          genderList: true, // 設計書に合わせて変更
          cat: true,
        },
      }),
      this.prisma.pedigree.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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

  async findByPedigreeId(pedigreeId: string) {
    const pedigree = await this.prisma.pedigree.findUnique({
      where: { pedigreeId },
      include: {
        breed: true,
        color: true,
        genderList: true, // 設計書に合わせて変更
        cat: true,
      },
    });

    if (!pedigree) {
      throw new NotFoundException(`血統書番号 ${pedigreeId} が見つかりません`);
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

    return this.prisma.pedigree.update({
      where: { id },
      data: updateData,
      include: {
        breed: true,
        color: true,
        genderList: true, // 設計書に合わせて変更
        cat: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // 存在確認

    return this.prisma.pedigree.delete({
      where: { id },
    });
  }

  // 血統書統計情報の取得（設計書準拠）
  async getStatistics() {
    const [
      totalCount,
      breedStats,
      genderStats,
      recentCount,
    ] = await Promise.all([
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

    return {
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
  }
}
