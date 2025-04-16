"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelUploadController = void 0;
const MasterDataTypeService_1 = require("../services/MasterDataTypeService");
const ExcelUploadService_1 = require("../services/ExcelUploadService");
class ExcelUploadController {
    constructor() {
        this.typeService = new MasterDataTypeService_1.MasterDataTypeService();
        this.uploadService = new ExcelUploadService_1.ExcelUploadService();
    }
    async upload(req, res) {
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
        }
        catch (error) {
            res.status(500).json({ error: `Failed to process Excel file: ${error.message}` });
        }
    }
}
exports.ExcelUploadController = ExcelUploadController;
