import { Request, Response } from 'express';
import { MasterDataVersionService } from '../services/MasterDataVersionService';
import { MasterDataTypeService } from '../services/MasterDataTypeService';

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
      const masterDataType = await this.typeService.findById(mdmId);
      if (!masterDataType) {
        res.status(404).json({ error: 'Master data type not found' });
        return;
      }

      const version = await this.versionService.create(masterDataType, fields);
      res.status(201).json(version);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create version' });
    }
  }

  async getVersionsByType(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId } = req.params;
      const versions = await this.versionService.getVersionsByType(mdmId);
      res.json(versions);
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
      res.json(versionData);
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
      res.json(version);
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
      res.json(version);
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
}