"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataVersionService = void 0;
const database_1 = require("../config/database");
const MasterDataVersion_1 = require("../models/MasterDataVersion");
class MasterDataVersionService {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(MasterDataVersion_1.MasterDataVersion);
    }
    async create(masterDataType, fields) {
        const latestVersion = await this.repository.findOne({
            where: { masterDataType: { id: masterDataType.id } },
            order: { version: 'DESC' }
        });
        const newVersion = new MasterDataVersion_1.MasterDataVersion();
        newVersion.version = latestVersion ? latestVersion.version + 1 : 1;
        newVersion.masterDataType = masterDataType;
        newVersion.fields = fields;
        newVersion.tagList = [];
        return this.repository.save(newVersion);
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['masterDataType', 'records']
        });
    }
    async findByTypeAndVersion(typeId, version) {
        return this.repository.findOne({
            where: {
                masterDataType: { id: typeId },
                version
            },
            relations: ['masterDataType', 'records']
        });
    }
    async findByTypeAndTag(typeId, tag) {
        return this.repository.findOne({
            where: {
                masterDataType: { id: typeId },
                tagList: tag
            },
            relations: ['masterDataType', 'records']
        });
    }
    async addTag(id, tag) {
        const version = await this.findById(id);
        if (!version)
            return null;
        if (!version.tagList.includes(tag)) {
            version.tagList.push(tag);
            return this.repository.save(version);
        }
        return version;
    }
    async removeTag(id, tag) {
        const version = await this.findById(id);
        if (!version)
            return null;
        version.tagList = version.tagList.filter(t => t !== tag);
        return this.repository.save(version);
    }
    async getVersionsByType(typeId) {
        return this.repository.find({
            where: { masterDataType: { id: typeId } },
            relations: ['masterDataType'],
            order: { version: 'DESC' }
        });
    }
}
exports.MasterDataVersionService = MasterDataVersionService;
