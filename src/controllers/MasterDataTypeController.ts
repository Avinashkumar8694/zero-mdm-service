import { Request, Response } from 'express';
import { MasterDataTypeService } from '../services/MasterDataTypeService';

export class MasterDataTypeController {
  private service: MasterDataTypeService;

  constructor() {
    this.service = new MasterDataTypeService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      const masterDataType = await this.service.create(name, description);
      res.status(201).json(masterDataType);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create master data type' });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const types = await this.service.findAll();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch master data types' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const type = await this.service.findById(id);
      if (!type) {
        res.status(404).json({ error: 'Master data type not found' });
        return;
      }
      res.json(type);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch master data type' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const updatedType = await this.service.update(id, name, description);
      if (!updatedType) {
        res.status(404).json({ error: 'Master data type not found' });
        return;
      }
      res.json(updatedType);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update master data type' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.service.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Master data type not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete master data type' });
    }
  }
}