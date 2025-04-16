"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataVersion = void 0;
const typeorm_1 = require("typeorm");
const MasterDataType_1 = require("./MasterDataType");
const MasterDataRecord_1 = require("./MasterDataRecord");
let MasterDataVersion = class MasterDataVersion {
};
exports.MasterDataVersion = MasterDataVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MasterDataVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MasterDataVersion.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], MasterDataVersion.prototype, "tagList", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], MasterDataVersion.prototype, "fields", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MasterDataVersion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterDataType_1.MasterDataType, type => type.versions),
    __metadata("design:type", MasterDataType_1.MasterDataType)
], MasterDataVersion.prototype, "masterDataType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MasterDataRecord_1.MasterDataRecord, record => record.version),
    __metadata("design:type", Array)
], MasterDataVersion.prototype, "records", void 0);
exports.MasterDataVersion = MasterDataVersion = __decorate([
    (0, typeorm_1.Entity)('master_data_versions')
], MasterDataVersion);
