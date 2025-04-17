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
      
      if (!versionId) {
        res.status(400).json({ error: 'versionId is required' });
        return;
      }

      const version = await this.versionService.findById(versionId);
      if (!version) {
        res.status(404).json({ error: 'Version not found' });
        return;
      }

      const record = await this.recordService.create(version, data);
      const { id, data: recordData, createdAt } = record;
      res.status(201).json({ id, data: recordData, createdAt, versionId: version.id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create record' });
    }
  }

  async findByVersion(req: Request, res: Response): Promise<void> {
    try {
      const { versionId } = req.params;
      const records = await this.recordService.findByVersion(versionId);
      const simplifiedRecords = records.map(record => ({
        id: record.id,
        data: record.data,
        createdAt: record.createdAt,
        versionId
      }));
      res.json(simplifiedRecords);
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
      const { data: recordData, createdAt } = record;
      res.json({ id, data: recordData, createdAt, versionId: record.version.id });
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
      const { data: recordData, createdAt } = updatedRecord;
      res.json({ id, data: recordData, createdAt, versionId: updatedRecord.version.id });
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
      const simplifiedRecords = records.map(record => ({
        id: record.id,
        data: record.data,
        createdAt: record.createdAt,
        versionId
      }));
      res.json(simplifiedRecords);
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
      const { id, data: recordData, createdAt } = record;
      res.status(201).json({ id, data: recordData, createdAt, versionId: versionData.id });
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
      const { data: recordData, createdAt } = updatedRecord;
      res.json({ id: recordId, data: recordData, createdAt, versionId: versionData.id });
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