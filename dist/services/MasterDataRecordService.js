"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataRecordService = void 0;
const database_1 = require("../config/database");
const MasterDataRecord_1 = require("../models/MasterDataRecord");
class MasterDataRecordService {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(MasterDataRecord_1.MasterDataRecord);
    }
    async create(version, data) {
        const record = new MasterDataRecord_1.MasterDataRecord();
        record.version = version;
        record.data = data;
        return this.repository.save(record);
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['version']
        });
    }
    async findByVersion(versionId) {
        return this.repository.find({
            where: { version: { id: versionId } },
            relations: ['version']
        });
    }
    async update(id, data) {
        const record = await this.findById(id);
        if (!record)
            return null;
        record.data = Object.assign(Object.assign({}, record.data), data);
        return this.repository.save(record);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
    async searchByFilter(versionId, filter) {
        const records = await this.findByVersion(versionId);
        return records.filter(record => {
            return Object.entries(filter).every(([key, value]) => {
                return record.data[key] === value;
            });
        });
    }
}
exports.MasterDataRecordService = MasterDataRecordService;
