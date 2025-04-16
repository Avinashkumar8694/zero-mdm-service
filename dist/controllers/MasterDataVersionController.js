"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataVersionController = void 0;
const MasterDataVersionService_1 = require("../services/MasterDataVersionService");
const MasterDataTypeService_1 = require("../services/MasterDataTypeService");
class MasterDataVersionController {
    constructor() {
        this.versionService = new MasterDataVersionService_1.MasterDataVersionService();
        this.typeService = new MasterDataTypeService_1.MasterDataTypeService();
    }
    async create(req, res) {
        try {
            const { mdmId, fields } = req.body;
            const masterDataType = await this.typeService.findById(mdmId);
            if (!masterDataType) {
                res.status(404).json({ error: 'Master data type not found' });
                return;
            }
            const version = await this.versionService.create(masterDataType, fields);
            res.status(201).json(version);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create version' });
        }
    }
    async getVersionsByType(req, res) {
        try {
            const { mdmId } = req.params;
            const versions = await this.versionService.getVersionsByType(mdmId);
            res.json(versions);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch versions' });
        }
    }
    async findByVersion(req, res) {
        try {
            const { mdmId, version } = req.params;
            const versionData = await this.versionService.findByTypeAndVersion(mdmId, parseInt(version));
            if (!versionData) {
                res.status(404).json({ error: 'Version not found' });
                return;
            }
            res.json(versionData);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch version' });
        }
    }
    async findByTag(req, res) {
        try {
            const { mdmId, tag } = req.params;
            const version = await this.versionService.findByTypeAndTag(mdmId, tag);
            if (!version) {
                res.status(404).json({ error: 'Version not found for the given tag' });
                return;
            }
            res.json(version);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch version by tag' });
        }
    }
    async addTag(req, res) {
        try {
            const { versionId } = req.params;
            const { tag } = req.body;
            const version = await this.versionService.addTag(versionId, tag);
            if (!version) {
                res.status(404).json({ error: 'Version not found' });
                return;
            }
            res.json(version);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to add tag' });
        }
    }
    async removeTag(req, res) {
        try {
            const { versionId, tag } = req.params;
            const version = await this.versionService.removeTag(versionId, tag);
            if (!version) {
                res.status(404).json({ error: 'Version not found' });
                return;
            }
            res.json(version);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to remove tag' });
        }
    }
}
exports.MasterDataVersionController = MasterDataVersionController;
