"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataRecordController = void 0;
const MasterDataRecordService_1 = require("../services/MasterDataRecordService");
const MasterDataVersionService_1 = require("../services/MasterDataVersionService");
class MasterDataRecordController {
    constructor() {
        this.recordService = new MasterDataRecordService_1.MasterDataRecordService();
        this.versionService = new MasterDataVersionService_1.MasterDataVersionService();
    }
    async create(req, res) {
        try {
            const { versionId, data } = req.body;
            const version = await this.versionService.findById(versionId);
            if (!version) {
                res.status(404).json({ error: 'Version not found' });
                return;
            }
            const record = await this.recordService.create(version, data);
            res.status(201).json(record);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create record' });
        }
    }
    async findByVersion(req, res) {
        try {
            const { versionId } = req.params;
            const records = await this.recordService.findByVersion(versionId);
            res.json(records);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const record = await this.recordService.findById(id);
            if (!record) {
                res.status(404).json({ error: 'Record not found' });
                return;
            }
            res.json(record);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch record' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            const updatedRecord = await this.recordService.update(id, data);
            if (!updatedRecord) {
                res.status(404).json({ error: 'Record not found' });
                return;
            }
            res.json(updatedRecord);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update record' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await this.recordService.delete(id);
            if (!deleted) {
                res.status(404).json({ error: 'Record not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete record' });
        }
    }
    async search(req, res) {
        try {
            const { versionId } = req.params;
            const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
            const records = await this.recordService.searchByFilter(versionId, filter);
            res.json(records);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to search records' });
        }
    }
}
exports.MasterDataRecordController = MasterDataRecordController;
