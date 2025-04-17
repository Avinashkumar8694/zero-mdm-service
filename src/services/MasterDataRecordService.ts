import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { MasterDataRecord } from '../models/MasterDataRecord';
import { MasterDataVersion } from '../models/MasterDataVersion';

export class MasterDataRecordService {
  private repository: Repository<MasterDataRecord>;

  constructor() {
    this.repository = AppDataSource.getRepository(MasterDataRecord);
  }

  private validateFields(data: Record<string, any>, fields: string[]): boolean {
    const dataFields = Object.keys(data);
    return fields.every(field => dataFields.includes(field)) &&
           dataFields.every(field => fields.includes(field));
  }

  async create(version: MasterDataVersion, data: Record<string, any>): Promise<MasterDataRecord> {
    // For new versions without fields, use the first record's fields as schema
    if (!version.fields || version.fields.length === 0) {
      version.fields = Object.keys(data);
      await AppDataSource.getRepository(MasterDataVersion).save(version);
    } else {
      // Validate that the data matches the version's field schema
      if (!this.validateFields(data, version.fields)) {
        throw new Error(`Record data fields do not match version schema. Expected fields: ${version.fields.join(', ')}`);
      }
    }

    const record = new MasterDataRecord();
    record.version = version;
    record.data = data;

    return this.repository.save(record);
  }

  async findById(id: string): Promise<MasterDataRecord | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['version']
    });
  }

  async findByVersion(versionId: string): Promise<MasterDataRecord[]> {
    return this.repository.find({
      where: { version: { id: versionId } },
      relations: ['version']
    });
  }

  async update(id: string, data: Record<string, any>): Promise<MasterDataRecord | null> {
    const record = await this.findById(id);
    if (!record) return null;

    record.data = { ...record.data, ...data };
    return this.repository.save(record);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async searchByFilter(versionId: string, filter: Record<string, any>): Promise<MasterDataRecord[]> {
    const records = await this.findByVersion(versionId);
    return records.filter(record => {
      return Object.entries(filter).every(([key, value]) => {
        return record.data[key] === value;
      });
    });
  }
}