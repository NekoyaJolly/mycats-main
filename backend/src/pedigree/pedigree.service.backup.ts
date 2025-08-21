import { Injectable, NotFoundException } from '@nestjs/common';
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
      genderCode: createPedigreeDto.genderCode,
      eyeColor: createPedigreeDto.eyeColor,
      coatColorCode: createPedigreeDto.coatColorCode,
      birthDate: createPedigreeDto.birthDate,
      breederName: createPedigreeDto.breederName,
      ownerName: createPedigreeDto.ownerName,
      registrationDate: createPedigreeDto.registrationDate,
      brotherCount: createPedigreeDto.brotherCount,
      sisterCount: createPedigreeDto.sisterCount,
      notes: createPedigreeDto.notes,
      notes2: createPedigreeDto.notes2,
      otherNo: createPedigreeDto.otherNo,
      fatherTitle: createPedigreeDto.fatherTitle,
      fatherCatName: createPedigreeDto.fatherCatName,
      fatherCatName2: createPedigreeDto.fatherCatName2,
      fatherCoatColor: createPedigreeDto.fatherCoatColor,
      fatherEyeColor: createPedigreeDto.fatherEyeColor,
      fatherJCU: createPedigreeDto.fatherJCU,
      fatherOtherCode: createPedigreeDto.fatherOtherCode,
      motherTitle: createPedigreeDto.motherTitle,
      motherCatName: createPedigreeDto.motherCatName,
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
        genderList: true,
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
    } = query as any;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { catName: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { breederName: { contains: search, mode: 'insensitive' } },
        { ownerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (genderCode !== undefined && genderCode !== null) {
      where.genderCode = parseInt(String(genderCode), 10);
    }
    if (eyeColor) {
      where.eyeColor = { contains: eyeColor, mode: 'insensitive' };
    }
    if (catName2) {
      where.catName2 = { contains: catName2, mode: 'insensitive' };
    }

    const [pedigrees, total] = await Promise.all([
      this.prisma.pedigree.findMany({
        where,
        skip,
        take: limit,
        include: {
          breed: true,
          color: true,
          cat: true,
          genderList: true,
        },
        orderBy: {
          [sortBy]: sortOrder as any,
        },
      }),
      this.prisma.pedigree.count({ where }),
    ]);

    return {
      data: pedigrees,
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
        cat: true,
        genderList: true,
      },
    });

    if (!pedigree) {
      throw new NotFoundException(`Pedigree with ID ${id} not found`);
    }

    return pedigree;
  }

  async update(id: string, updatePedigreeDto: UpdatePedigreeDto) {
    const existingPedigree = await this.prisma.pedigree.findUnique({
      where: { id },
    });

    if (!existingPedigree) {
      throw new NotFoundException(`Pedigree with ID ${id} not found`);
    }

    // 設計書に準拠したデータ準備
    const updateData: any = {
      pedigreeId: updatePedigreeDto.pedigreeId,
      title: updatePedigreeDto.title,
      catName: updatePedigreeDto.catName,
      catName2: updatePedigreeDto.catName2,
      breedCode: updatePedigreeDto.breedCode,
      genderCode: updatePedigreeDto.genderCode,
      eyeColor: updatePedigreeDto.eyeColor,
      coatColorCode: updatePedigreeDto.coatColorCode,
      birthDate: updatePedigreeDto.birthDate,
      breederName: updatePedigreeDto.breederName,
      ownerName: updatePedigreeDto.ownerName,
      registrationDate: updatePedigreeDto.registrationDate,
      brotherCount: updatePedigreeDto.brotherCount,
      sisterCount: updatePedigreeDto.sisterCount,
      notes: updatePedigreeDto.notes,
      notes2: updatePedigreeDto.notes2,
      otherNo: updatePedigreeDto.otherNo,
      fatherTitle: updatePedigreeDto.fatherTitle,
      fatherCatName: updatePedigreeDto.fatherCatName,
      fatherCatName2: updatePedigreeDto.fatherCatName2,
      fatherCoatColor: updatePedigreeDto.fatherCoatColor,
      fatherEyeColor: updatePedigreeDto.fatherEyeColor,
      fatherJCU: updatePedigreeDto.fatherJCU,
      fatherOtherCode: updatePedigreeDto.fatherOtherCode,
      motherTitle: updatePedigreeDto.motherTitle,
      motherCatName: updatePedigreeDto.motherCatName,
      motherCatName2: updatePedigreeDto.motherCatName2,
      motherCoatColor: updatePedigreeDto.motherCoatColor,
      motherEyeColor: updatePedigreeDto.motherEyeColor,
      motherJCU: updatePedigreeDto.motherJCU,
      motherOtherCode: updatePedigreeDto.motherOtherCode,
      oldCode: updatePedigreeDto.oldCode,
      catId: updatePedigreeDto.catId,
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
        cat: true,
        genderList: true,
      },
    });
  }

  private async buildFamilyTree(
    pedigreeData: any,
    currentGeneration: number,
    maxGenerations: number,
  ): Promise<any> {
    const result: any = { ...pedigreeData };

    if (currentGeneration >= maxGenerations) {
      // Do not expand further
      return result;
    }

    if (pedigreeData.fatherPedigreeId) {
      const father = await this.prisma.pedigree.findUnique({
        where: { id: pedigreeData.fatherPedigreeId },
        include: {
          breed: true,
          color: true,
          genderList: true,
        },
      });
      if (father) {
        result.father = await this.buildFamilyTree(
          father,
          currentGeneration + 1,
          maxGenerations,
        );
      }
    }

    if (pedigreeData.motherPedigreeId) {
      const mother = await this.prisma.pedigree.findUnique({
        where: { id: pedigreeData.motherPedigreeId },
        include: {
          breed: true,
          color: true,
          genderList: true,
        },
      });
      if (mother) {
        result.mother = await this.buildFamilyTree(
          mother,
          currentGeneration + 1,
          maxGenerations,
        );
      }
    }

    return result;
  }

  async getFamilyTree(id: string, generations: number = 3) {
    const pedigree = await this.prisma.pedigree.findUnique({
      where: { id },
      include: {
        breed: true,
        color: true,
        genderList: true,
      },
    });

    if (!pedigree) {
      throw new NotFoundException(`Pedigree with ID ${id} not found`);
    }

    return this.buildFamilyTree(pedigree, 0, generations);
  }
}
