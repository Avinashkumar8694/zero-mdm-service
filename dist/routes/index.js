"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const MasterDataTypeController_1 = require("../controllers/MasterDataTypeController");
const MasterDataVersionController_1 = require("../controllers/MasterDataVersionController");
const MasterDataRecordController_1 = require("../controllers/MasterDataRecordController");
const setupRoutes = (app) => {
    const typeController = new MasterDataTypeController_1.MasterDataTypeController();
    const versionController = new MasterDataVersionController_1.MasterDataVersionController();
    const recordController = new MasterDataRecordController_1.MasterDataRecordController();
    // Master Data Type Routes
    app.post('/mdm/types', typeController.create.bind(typeController));
    app.get('/mdm/types', typeController.findAll.bind(typeController));
    app.get('/mdm/types/:id', typeController.findById.bind(typeController));
    app.put('/mdm/types/:id', typeController.update.bind(typeController));
    app.delete('/mdm/types/:id', typeController.delete.bind(typeController));
    // Version Management Routes
    app.post('/mdm/:mdmId/versions', versionController.create.bind(versionController));
    app.get('/mdm/:mdmId/versions', versionController.getVersionsByType.bind(versionController));
    app.get('/mdm/:mdmId/versions/:version', versionController.findByVersion.bind(versionController));
    app.get('/mdm/:mdmId/versions/tag/:tag', versionController.findByTag.bind(versionController));
    app.post('/mdm/versions/:versionId/tags', versionController.addTag.bind(versionController));
    app.delete('/mdm/versions/:versionId/tags/:tag', versionController.removeTag.bind(versionController));
    // Record Management Routes
    app.post('/mdm/records', recordController.create.bind(recordController));
    app.get('/mdm/versions/:versionId/records', recordController.findByVersion.bind(recordController));
    app.get('/mdm/records/:id', recordController.findById.bind(recordController));
    app.put('/mdm/records/:id', recordController.update.bind(recordController));
    app.delete('/mdm/records/:id', recordController.delete.bind(recordController));
    app.get('/mdm/versions/:versionId/records/search', recordController.search.bind(recordController));
};
exports.setupRoutes = setupRoutes;
