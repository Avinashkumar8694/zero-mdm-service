import { Request, Response } from 'express';
import { MasterDataRecordService } from '../services/MasterDataRecordService';
import { MasterDataVersionService } from '../services/MasterDataVersionService';
import { MasterDataTypeService } from '../services/MasterDataTypeService';

export class MasterDataRecordController {
  private recordService: MasterDataRecordService;
  private versionService: MasterDataVersionService;
  private typeService: MasterDataTypeService;

  constructor() {
    this.recordService = new MasterDataRecordService();
    this.versionService = new MasterDataVersionService();
    this.typeService = new MasterDataTypeService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { versionId, data } = req.body;
      const version = await this.versionService.findById(versionId);
      if (!version) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }

      const record = await this.recordService.create(version, data);
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create record' });
    }
  }

  async findByVersion(req: Request, res: Response): Promise<void> {
    try {
      const { versionId } = req.params;
      const records = await this.recordService.findByVersion(versionId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const record = await this.recordService.findById(id);
      if (!record) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch record' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedRecord = await this.recordService.update(id, data);
      if (!updatedRecord) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update record' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.recordService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete record' });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const { versionId } = req.params;
      const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
      const records = await this.recordService.searchByFilter(versionId, filter);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search records' });
    }
  }

  async createWithVersion(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId, version } = req.params;
      const { data } = req.body;

      const versionData = await this.versionService.findByTypeAndVersion(mdmId, parseInt(version));
      if (!versionData) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }

      const record = await this.recordService.create(versionData, data);
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create record' });
    }
  }

  async updateWithVersion(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId, version, recordId } = req.params;
      const { data } = req.body;

      const versionData = await this.versionService.findByTypeAndVersion(mdmId, parseInt(version));
      if (!versionData) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }

      const record = await this.recordService.findById(recordId);
      if (!record || record.version.id !== versionData.id) {
        res.status(404).json({ error: 'Record not found in specified version' });
        return;
      }

      const updatedRecord = await this.recordService.update(recordId, data);
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update record' });
    }
  }

  async deleteWithVersion(req: Request, res: Response): Promise<void> {
    try {
      const { mdmId, version, recordId } = req.params;

      const versionData = await this.versionService.findByTypeAndVersion(mdmId, parseInt(version));
      if (!versionData) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }

      const record = await this.recordService.findById(recordId);
      if (!record || record.version.id !== versionData.id) {
        res.status(404).json({ error: 'Record not found in specified version' });
        return;
      }

      await this.recordService.delete(recordId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete record' });
    }
  }
}