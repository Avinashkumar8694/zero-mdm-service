import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { MasterDataType } from '../models/MasterDataType';
import { MasterDataVersion } from '../models/MasterDataVersion';

export class MasterDataTypeService {
  private repository: Repository<MasterDataType>;

  constructor() {
    this.repository = AppDataSource.getRepository(MasterDataType);
  }

  async create(name: string, description?: string): Promise<MasterDataType> {
    const masterDataType = new MasterDataType();
    masterDataType.name = name;
    masterDataType.description = description;

    return this.repository.save(masterDataType);
  }

  async findAll(): Promise<MasterDataType[]> {
    return this.repository.find({
      relations: ['versions']
    });
  }

  async findById(id: string): Promise<MasterDataType | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['versions']
    });
  }

  async findByName(name: string): Promise<MasterDataType | null> {
    return this.repository.findOne({
      where: { name },
      relations: ['versions']
    });
  }

  async update(id: string, name?: string, description?: string): Promise<MasterDataType | null> {
    const masterDataType = await this.findById(id);
    if (!masterDataType) return null;

    if (name) masterDataType.name = name;
    if (description) masterDataType.description = description;

    return this.repository.save(masterDataType);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}