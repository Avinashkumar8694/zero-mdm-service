"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataTypeService = void 0;
const database_1 = require("../config/database");
const MasterDataType_1 = require("../models/MasterDataType");
class MasterDataTypeService {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(MasterDataType_1.MasterDataType);
    }
    async create(name, description) {
        const masterDataType = new MasterDataType_1.MasterDataType();
        masterDataType.name = name;
        masterDataType.description = description;
        return this.repository.save(masterDataType);
    }
    async findAll() {
        return this.repository.find({
            relations: ['versions']
        });
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['versions']
        });
    }
    async findByName(name) {
        return this.repository.findOne({
            where: { name },
            relations: ['versions']
        });
    }
    async update(id, name, description) {
        const masterDataType = await this.findById(id);
        if (!masterDataType)
            return null;
        if (name)
            masterDataType.name = name;
        if (description)
            masterDataType.description = description;
        return this.repository.save(masterDataType);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
exports.MasterDataTypeService = MasterDataTypeService;
