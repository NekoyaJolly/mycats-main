import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatDto, CatGender } from './dto/create-cat.dto';
import { CatQueryDto } from './dto/cat-query.dto';

describe('CatsService', () => {
  let service: CatsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cat: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('すべての猫を取得できること', async () => {
      const mockCats = [
        {
          id: 1,
          registrationId: 'CAT001',
          name: 'テスト猫1',
          breed: { id: 1, name: 'ペルシャ' },
          coatColor: { id: 1, name: '白' },
          birthDate: new Date('2023-01-01'),
          gender: CatGender.FEMALE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockQuery: CatQueryDto = {
        page: 1,
        limit: 10,
      };

      mockPrismaService.cat.findMany.mockResolvedValue(mockCats);
      mockPrismaService.cat.count.mockResolvedValue(1);

      const result = await service.findAll(mockQuery);
      
      expect(result.data).toEqual(mockCats);
      expect(result.meta.total).toBe(1);
      expect(mockPrismaService.cat.findMany).toHaveBeenCalled();
      expect(mockPrismaService.cat.count).toHaveBeenCalled();
    });

    it('データベースエラーが発生した場合、例外を投げること', async () => {
      const mockQuery: CatQueryDto = {
        page: 1,
        limit: 10,
      };

      mockPrismaService.cat.findMany.mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll(mockQuery)).rejects.toThrow('DB Error');
    });
  });

  describe('findOne', () => {
    it('指定されたIDの猫を取得できること', async () => {
      const mockCat = {
        id: 1,
        registrationId: 'CAT001',
        name: 'テスト猫1',
        breed: { id: 1, name: 'ペルシャ' },
        color: { id: 1, name: '白' },
        birthDate: new Date('2023-01-01'),
        gender: CatGender.FEMALE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.cat.findUnique.mockResolvedValue(mockCat);

      const result = await service.findOne('1');
      
      expect(result).toEqual(mockCat);
      expect(mockPrismaService.cat.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          include: expect.any(Object),
        })
      );
    });

    it('存在しないIDが指定された場合、例外を投げること', async () => {
      mockPrismaService.cat.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow('Cat with ID 999 not found');
    });
  });

  describe('create', () => {
    it('新しい猫を作成できること', async () => {
      const createCatDto: CreateCatDto = {
        registrationId: 'CAT002',
        name: '新しい猫',
        breedName: 'ペルシャ',
        colorName: '白',
        birthDate: '2024-01-01',
        gender: CatGender.MALE,
        ownerId: '1',
      };

      const mockCreatedCat = {
        id: 2,
        ...createCatDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.cat.create.mockResolvedValue(mockCreatedCat);

      const result = await service.create(createCatDto);
      
      expect(result).toEqual(mockCreatedCat);
      expect(mockPrismaService.cat.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: createCatDto,
          include: expect.any(Object),
        })
      );
    });
  });
});
