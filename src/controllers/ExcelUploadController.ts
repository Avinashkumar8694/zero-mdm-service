import { Request, Response } from 'express';
import { MasterDataTypeService } from '../services/MasterDataTypeService';
import { ExcelUploadService } from '../services/ExcelUploadService';

export class ExcelUploadController {
  private typeService: MasterDataTypeService;
  private uploadService: ExcelUploadService;

  constructor() {
    this.typeService = new MasterDataTypeService();
    this.uploadService = new ExcelUploadService();
  }

  async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { mdmId } = req.params;
      const masterDataType = await this.typeService.findById(mdmId);
      if (!masterDataType) {
        res.status(404).json({ error: 'Master data type not found' });
        return;
      }

      if (!this.uploadService.validateExcelFile(req.file)) {
        res.status(400).json({ error: 'Invalid file format. Only Excel files are allowed' });
        return;
      }

      const version = await this.uploadService.processExcelUpload(req.file, masterDataType);
      res.status(201).json(version);
    } catch (error) {
      res.status(500).json({ error: `Failed to process Excel file: ${error.message}` });
    }
  }
}