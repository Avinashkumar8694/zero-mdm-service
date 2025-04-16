import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { MasterDataVersion } from '../models/MasterDataVersion';
import { MasterDataRecord } from '../models/MasterDataRecord';
import { MasterDataVersionService } from './MasterDataVersionService';
import { MasterDataRecordService } from './MasterDataRecordService';
import { MasterDataType } from '../models/MasterDataType';

export class ExcelUploadService {
  private versionService: MasterDataVersionService;
  private recordService: MasterDataRecordService;

  constructor() {
    this.versionService = new MasterDataVersionService();
    this.recordService = new MasterDataRecordService();
  }

  async processExcelUpload(file: Express.Multer.File, masterDataType: MasterDataType): Promise<MasterDataVersion> {
    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        throw new Error('Excel file is empty');
      }

      // Extract fields from the first row
      const fields = Object.keys(data[0]);

      // Create a new version
      const version = await this.versionService.create(masterDataType, fields);

      // Create records for each row
      for (const row of data) {
        await this.recordService.create(version, row);
      }

      return version;
    } catch (error: any) {
      throw new Error(`Failed to process Excel file: ${error.message}`);
    }
  }

  validateExcelFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }
}