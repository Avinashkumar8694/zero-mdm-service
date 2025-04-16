"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataTypeController = void 0;
const MasterDataTypeService_1 = require("../services/MasterDataTypeService");
class MasterDataTypeController {
    constructor() {
        this.service = new MasterDataTypeService_1.MasterDataTypeService();
    }
    async create(req, res) {
        try {
            const { name, description } = req.body;
            const masterDataType = await this.service.create(name, description);
            res.status(201).json(masterDataType);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create master data type' });
        }
    }
    async findAll(req, res) {
        try {
            const types = await this.service.findAll();
            res.json(types);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch master data types' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const type = await this.service.findById(id);
            if (!type) {
                res.status(404).json({ error: 'Master data type not found' });
                return;
            }
            res.json(type);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch master data type' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const updatedType = await this.service.update(id, name, description);
            if (!updatedType) {
                res.status(404).json({ error: 'Master data type not found' });
                return;
            }
            res.json(updatedType);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update master data type' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await this.service.delete(id);
            if (!deleted) {
                res.status(404).json({ error: 'Master data type not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete master data type' });
        }
    }
}
exports.MasterDataTypeController = MasterDataTypeController;
