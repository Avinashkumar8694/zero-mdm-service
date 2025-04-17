import { Request, Response } from 'express';
import { MasterDataVersionService } from '../services/MasterDataVersionService';
import { MasterDataTypeService } from '../services/MasterDataTypeService';
import { MasterDataRecordService } from '../services/MasterDataRecordService';

export class MasterDataVersionController {
  private versionService: MasterDataVersionService;
  private typeService: MasterDataTypeService;

  constructor() {
    this.versionService = new MasterDataVersionService();
    this.typeService = new MasterDataTypeService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId, fields } = req.body;
      
      if (!fields || !Array.isArray(fields) || fields.length === 0) {
        res.status(400).json({ error: 'Fields property is required and must be a non-empty array' });
        return;
      }

      const masterDataType = await this.typeService.findById(mdmId);
      if (!masterDataType) {
        res.status(404).json({ error: 'Master data type not found' });
        return;
      }

      const version = await this.versionService.create(masterDataType, fields);
      res.status(201).json({
        id: version.id,
        version: version.version,
        fields: version.fields,
        createdAt: version.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create version' });
    }
  }

  async getVersionsByType(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId } = req.params;
      const versions = await this.versionService.getVersionsByType(mdmId);
      const simplifiedVersions = versions.map(version => ({
        id: version.id,
        version: version.version,
        fields: version.fields,
        tagList: version.tagList,
        createdAt: version.createdAt
      }));
      res.json(simplifiedVersions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch versions' });
    }
  }

  async findByVersion(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId, version } = req.params;
      
      let versionData;
      if (version === 'latest') {
        versionData = await this.versionService.getLatestVersion(mdmId);
      } else {
        const versionNumber = parseInt(version);
        if (isNaN(versionNumber)) {
          res.status(400).json({ error: 'Invalid version format. Must be a number or "latest"' });
          return;
        }
        versionData = await this.versionService.findByTypeAndVersion(mdmId, versionNumber);
      }

      if (!versionData) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }

      const simplifiedVersion = {
        id: versionData.id,
        version: versionData.version,
        fields: versionData.fields,
        tagList: versionData.tagList,
        createdAt: versionData.createdAt
      };
      res.json(simplifiedVersion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch version' });
    }
  }

  async findByTag(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId, tag } = req.params;
      const version = await this.versionService.findByTypeAndTag(mdmId, tag);
      if (!version) {
        res.status(404).json({ error: 'Version not found for the given tag' });
        return;
      }
      const simplifiedVersion = {
        id: version.id,
        version: version.version,
        fields: version.fields,
        tagList: version.tagList,
        createdAt: version.createdAt
      };
      res.json(simplifiedVersion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch version by tag' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { versionId } = req.params;
      const version = await this.versionService.findById(versionId);
      if (!version) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }
      const simplifiedVersion = {
        id: version.id,
        version: version.version,
        fields: version.fields,
        tagList: version.tagList,
        createdAt: version.createdAt
      };
      res.json(simplifiedVersion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch version' });
    }
  }

  async addTag(req: Request, res: Response): Promise<void> {
    try {
      const { versionId } = req.params;
      const { tag } = req.body;
      const version = await this.versionService.addTag(versionId, tag);
      if (!version) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }
      res.json(version);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add tag' });
    }
  }

  async removeTag(req: Request, res: Response): Promise<void> {
    try {
      const { versionId, tag } = req.params;
      const version = await this.versionService.removeTag(versionId, tag);
      if (!version) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }
      const { id, version: versionNumber, tagList } = version;
      res.json({ id, version: versionNumber, tagList });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove tag' });
    }
  }

  async getLatestVersion(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId } = req.params;
      const version = await this.versionService.getLatestVersion(mdmId);
      if (!version) {
        res.status(404).json({ error: 'No versions found for this master data type' });
        return;
      }
      res.json(version);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch version' });
    }
  }

  async createWithData(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId } = req.params;
      const { fields, records } = req.body;

      if (!fields || !Array.isArray(fields) || fields.length === 0) {
        res.status(400).json({ error: 'Fields property is required and must be a non-empty array' });
        return;
      }

      const masterDataType = await this.typeService.findById(mdmId);
      if (!masterDataType) {
        res.status(404).json({ error: 'Master data type not found' });
        return;
      }

      if (records) {
        if (!Array.isArray(records)) {
          res.status(400).json({ error: 'Records must be an array' });
          return;
        }

        for (const record of records) {
          const recordFields = Object.keys(record);
          const missingFields = fields.filter(field => !recordFields.includes(field));
          const extraFields = recordFields.filter(field => !fields.includes(field));

          if (missingFields.length > 0) {
            res.status(400).json({ error: `Missing required fields in record: ${missingFields.join(', ')}` });
            return;
          }

          if (extraFields.length > 0) {
            res.status(400).json({ error: `Extra fields found in record: ${extraFields.join(', ')}` });
            return;
          }
        }
      }

      const version = await this.versionService.create(masterDataType, fields);
      
      if (records && Array.isArray(records)) {
        const recordService = new MasterDataRecordService();
        for (const recordData of records) {
          await recordService.create(version, recordData);
        }
      }

      const versionWithRecords = await this.versionService.findById(version.id);
      const response = {
        id: versionWithRecords.id,
        version: versionWithRecords.version,
        fields: versionWithRecords.fields,
        // records: versionWithRecords.records.map(record => ({
        //   id: record.id,
        //   data: record.data,
        //   createdAt: record.createdAt
        // }))
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create version with data' });
    }
  }
}