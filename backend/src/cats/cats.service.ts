import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatDto, UpdateCatDto, CatQueryDto } from './dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class CatsService {
  constructor(private prisma: PrismaService) {}

  async create(createCatDto: CreateCatDto) {
    return this.prisma.cat.create({
      data: {
        ...createCatDto,
      },
      include: {
        breed: true, // Name-based breed relation
        color: true, // Name-based color relation
        owner: true,
        father: true,
        mother: true,
        maleBreedingRecords: true,
        femaleBreedingRecords: true,
        careRecords: {
          orderBy: { careDate: 'desc' },
          take: 5,
        },
      },
    });
  }

  async findAll(query: CatQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      breedName,
      colorName,
      gender,
      ageMin,
      ageMax,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { microchipId: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filters
    if (breedName) where.breedName = breedName;
    if (colorName) where.colorName = colorName;
    if (gender) where.gender = gender;

    // Age filters
    if (ageMin || ageMax) {
      const now = new Date();
      if (ageMax) {
        const minBirthDate = new Date(
          now.getFullYear() - ageMax,
          now.getMonth(),
          now.getDate(),
        );
        where.birthDate = { gte: minBirthDate };
      }
      if (ageMin) {
        const maxBirthDate = new Date(
          now.getFullYear() - ageMin,
          now.getMonth(),
          now.getDate(),
        );
        where.birthDate = { ...where.birthDate, lte: maxBirthDate };
      }
    }

    const [cats, total] = await Promise.all([
      this.prisma.cat.findMany({
        where,
        skip,
        take: limit,
        include: {
          breed: {
            select: { id: true, name: true, code: true },
          },
          color: {
            select: { id: true, name: true, code: true },
          },
          owner: {
            select: { id: true, firstName: true, lastName: true },
          },
          // Optimize: Only include basic info for related cats
          father: {
            select: { id: true, name: true, registrationId: true },
          },
          mother: {
            select: { id: true, name: true, registrationId: true },
          },
          // Optimize: Limit breeding records
          maleBreedingRecords: {
            take: 3,
            orderBy: { breedingDate: 'desc' },
            select: {
              id: true,
              breedingDate: true,
              status: true,
              female: {
                select: { id: true, name: true },
              },
            },
          },
          femaleBreedingRecords: {
            take: 3,
            orderBy: { breedingDate: 'desc' },
            select: {
              id: true,
              breedingDate: true,
              status: true,
              male: {
                select: { id: true, name: true },
              },
            },
          },
          // Optimize: Limit care records
          careRecords: {
            take: 5,
            orderBy: { careDate: 'desc' },
            select: {
              id: true,
              careType: true,
              careDate: true,
              nextDueDate: true,
              description: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.cat.count({ where }),
    ]);

    return new PaginatedResponseDto(cats, page, limit, total);
  }

  async findOne(id: string) {
    const cat = await this.prisma.cat.findUnique({
      where: { id },
      include: {
        breed: true,
        color: true,
        pedigrees: {
          include: {
            breed: true,
            color: true,
            genderList: true,
          },
        },
        maleBreedingRecords: {
          include: {
            female: true,
          },
        },
        femaleBreedingRecords: {
          include: {
            male: true,
          },
        },
        careRecords: {
          orderBy: { careDate: 'desc' },
          include: {
            recorder: true,
          },
        },
      },
    });

    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }

    return cat;
  }

  async update(id: string, updateCatDto: UpdateCatDto) {
    const existingCat = await this.prisma.cat.findUnique({
      where: { id },
    });

    if (!existingCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }

    return this.prisma.cat.update({
      where: { id },
      data: {
        ...updateCatDto,
      },
      include: {
        breed: true,
        color: true,
        pedigrees: {
          include: {
            breed: true,
            color: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const existingCat = await this.prisma.cat.findUnique({
      where: { id },
    });

    if (!existingCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }

    return this.prisma.cat.delete({
      where: { id },
      include: {
        breed: true,
        color: true,
        pedigrees: true,
      },
    });
  }

  async getBreedingHistory(id: string) {
    const cat = await this.findOne(id);

    const breedingRecords = await this.prisma.breedingRecord.findMany({
      where: {
        OR: [{ maleId: id }, { femaleId: id }],
      },
      include: {
        male: {
          include: {
            breed: true,
            color: true,
          },
        },
        female: {
          include: {
            breed: true,
            color: true,
          },
        },
        recorder: true,
      },
      orderBy: {
        breedingDate: 'desc',
      },
    });

    return {
      cat,
      breedingRecords,
    };
  }

  async getCareHistory(id: string) {
    const cat = await this.findOne(id);

    const careRecords = await this.prisma.careRecord.findMany({
      where: { catId: id },
      include: {
        recorder: true,
      },
      orderBy: {
        careDate: 'desc',
      },
    });

    return {
      cat,
      careRecords,
    };
  }

  async getStatistics() {
    const [totalCats, totalMales, totalFemales, breedStats] = await Promise.all(
      [
        this.prisma.cat.count(),
        this.prisma.cat.count({ where: { gender: 'MALE' } }),
        this.prisma.cat.count({ where: { gender: 'FEMALE' } }),
        this.prisma.cat.groupBy({
          by: ['breedName'],
          _count: true,
          orderBy: {
            _count: {
              breedName: 'desc',
            },
          },
          take: 10,
        }),
      ],
    );

    // Process breed statistics (now using breedName directly)
    const breedStatsWithNames = breedStats.map(stat => ({
      breedName: stat.breedName,
      count: stat._count,
    }));

    return {
      total: totalCats,
      genderDistribution: {
        male: totalMales,
        female: totalFemales,
      },
      breedDistribution: breedStatsWithNames,
    };
  }
}
