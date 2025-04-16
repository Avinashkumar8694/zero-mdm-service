import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { MasterDataVersion } from '../models/MasterDataVersion';
import { MasterDataType } from '../models/MasterDataType';

export class MasterDataVersionService {
  private repository: Repository<MasterDataVersion>;

  constructor() {
    this.repository = AppDataSource.getRepository(MasterDataVersion);
  }

  async create(masterDataType: MasterDataType, fields: string[]): Promise<MasterDataVersion> {
    const latestVersion = await this.repository.findOne({
      where: { masterDataType: { id: masterDataType.id } },
      order: { version: 'DESC' }
    });

    const newVersion = new MasterDataVersion();
    newVersion.version = latestVersion ? latestVersion.version + 1 : 1;
    newVersion.masterDataType = masterDataType;
    newVersion.fields = fields;
    newVersion.tagList = [];

    return this.repository.save(newVersion);
  }

  async findById(id: string): Promise<MasterDataVersion | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['masterDataType', 'records']
    });
  }

  async findByTypeAndVersion(typeId: string, version: number): Promise<MasterDataVersion | null> {
    return this.repository.findOne({
      where: {
        masterDataType: { id: typeId },
        version
      },
      relations: ['masterDataType', 'records']
    });
  }

  async findByTypeAndTag(typeId: string, tag: string): Promise<MasterDataVersion | null> {
    return this.repository.findOne({
      where: {
        masterDataType: { id: typeId },
        tagList: tag
      },
      relations: ['masterDataType', 'records']
    });
  }

  async addTag(id: string, tag: string): Promise<MasterDataVersion | null> {
    const version = await this.findById(id);
    if (!version) return null;

    if (!version.tagList.includes(tag)) {
      version.tagList.push(tag);
      return this.repository.save(version);
    }

    return version;
  }

  async removeTag(id: string, tag: string): Promise<MasterDataVersion | null> {
    const version = await this.findById(id);
    if (!version) return null;

    version.tagList = version.tagList.filter(t => t !== tag);
    return this.repository.save(version);
  }

  async getVersionsByType(typeId: string): Promise<MasterDataVersion[]> {
    return this.repository.find({
      where: { masterDataType: { id: typeId } },
      relations: ['masterDataType'],
      order: { version: 'DESC' }
    });
  }

  async getLatestVersion(typeId: string): Promise<MasterDataVersion | null> {
    try {
      const versions = await this.repository.find({
        where: { masterDataType: { id: typeId } },
        relations: ['masterDataType', 'records'],
        order: { version: 'DESC' },
        take: 1
      });
      return versions.length > 0 ? versions[0] : null;
    } catch (error) {
      console.error('Error fetching latest version:', error);
      throw error;
    }
  }
}