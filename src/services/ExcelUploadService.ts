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
      // Log file object and buffer details for debugging
      console.log('Uploaded file object:', file);
      let fileBuffer: Buffer | undefined = file.buffer;
      if (!fileBuffer) {
        if (file.path) {
          const fs = require('fs');
          fileBuffer = fs.readFileSync(file.path);
          console.log('Read file buffer from disk, length:', fileBuffer.length);
        }
      }
      if (!fileBuffer) {
        throw new Error('Uploaded file or file buffer is missing.');
      }
      console.log('File buffer type:', typeof fileBuffer, 'Buffer length:', fileBuffer ? fileBuffer.length : 'undefined');
      if (!this.validateExcelFile(file)) {
        throw new Error('Invalid file format. Please upload a valid Excel file.');
      }

      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Excel file does not contain any sheets');
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        throw new Error('Failed to read worksheet from Excel file');
      }

      // Convert worksheet to array of arrays first to validate structure
      const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null, raw: false });
      console.log('rawData:', JSON.stringify(rawData));
      
      if (!Array.isArray(rawData) || rawData.length === 0) {
        throw new Error('Failed to parse Excel data. Please ensure the file contains valid tabular data.');
      }

      // Remove empty rows (all cells null/empty)
      const filteredRawData = rawData.filter(row => Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== ''));
      if (filteredRawData.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row.');
      }

      // Get headers from first row and validate
      const headers = filteredRawData[0];
      console.log('headers:', JSON.stringify(headers));
      if (!Array.isArray(headers) || headers.length === 0 || headers.some(h => !h)) {
        throw new Error('Invalid or empty headers in Excel file.');
      }

      // Convert raw data to objects using headers, skip empty rows
      const data = filteredRawData.slice(1).map((row, idx) => {
        if (!Array.isArray(row) || row.length === 0 || row.every(cell => cell === null || cell === undefined || cell === '')) {
          // Skip empty rows
          return null;
        }
        // Pad row if shorter than headers
        const paddedRow = [...row];
        while (paddedRow.length < headers.length) {
          paddedRow.push(null);
        }
        const obj: Record<string, any> = {};
        headers.forEach((header, i) => {
          obj[header] = paddedRow[i];
        });
        return obj;
      }).filter(row => row !== null);

      if (data.length === 0) {
        throw new Error('Excel file contains no data rows.');
      }

      // Validate all rows have valid data structure
      data.forEach((row, index) => {
        if (!row || typeof row !== 'object' || row === null) {
          throw new Error(`Invalid data structure in row ${index + 1}. Each row must be a valid object.`);
        }
      });

      const firstRow = data[0];
      if (!firstRow || typeof firstRow !== 'object' || Object.keys(firstRow).length === 0) {
        throw new Error('Invalid data format in Excel file. Please ensure the first row contains valid column headers.');
      }

      // Extract fields from the first row
      const fields = Object.keys(firstRow);
      if (fields.length === 0) {
        throw new Error('No columns found in Excel file');
      }

      // Create a new version
      const version = await this.versionService.create(masterDataType, fields);

      // Create records for each row
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || typeof row !== 'object' || row === null) {
          throw new Error(`Invalid data in row ${i + 1}. Each row must contain valid data.`);
        }

        // Validate all values in the row
        Object.entries(row).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            throw new Error(`Empty or invalid value found for field '${key}' in row ${i + 2}. All fields must have valid values.`);
          }
        });

        // Validate that all required fields are present
        for (const field of fields) {
          if (!(field in row)) {
            throw new Error(`Missing field '${field}' in row ${i + 2}. All fields must be present in each row.`);
          }
        }

        await this.recordService.create(version, row);
      }

      return version;
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      console.error('Excel processing error:', error);
      throw new Error(`Failed to process Excel file: ${errorMessage}`);
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