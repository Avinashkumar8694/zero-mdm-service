"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelUploadService = void 0;
const xlsx = __importStar(require("xlsx"));
const MasterDataVersionService_1 = require("./MasterDataVersionService");
const MasterDataRecordService_1 = require("./MasterDataRecordService");
class ExcelUploadService {
    constructor() {
        this.versionService = new MasterDataVersionService_1.MasterDataVersionService();
        this.recordService = new MasterDataRecordService_1.MasterDataRecordService();
    }
    async processExcelUpload(file, masterDataType) {
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
        }
        catch (error) {
            throw new Error(`Failed to process Excel file: ${error.message}`);
        }
    }
    validateExcelFile(file) {
        const allowedMimeTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        return allowedMimeTypes.includes(file.mimetype);
    }
}
exports.ExcelUploadService = ExcelUploadService;
