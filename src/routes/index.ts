import { Express } from 'express';
import multer from 'multer';
import path from 'path';
import { MasterDataTypeController } from '../controllers/MasterDataTypeController';
import { MasterDataVersionController } from '../controllers/MasterDataVersionController';
import { MasterDataRecordController } from '../controllers/MasterDataRecordController';
import { ExcelUploadController } from '../controllers/ExcelUploadController';

export const setupRoutes = (app: Express): void => {
  const typeController = new MasterDataTypeController();
  const versionController = new MasterDataVersionController();
  const recordController = new MasterDataRecordController();

  // Master Data Type Routes
  app.post('/api/mdm/types', typeController.create.bind(typeController));
  app.get('/api/mdm/types', typeController.findAll.bind(typeController));
  app.get('/api/mdm/types/:id', typeController.findById.bind(typeController));
  app.put('/api/mdm/types/:id', typeController.update.bind(typeController));
  app.delete('/api/mdm/types/:id', typeController.delete.bind(typeController));

  // Version Management Routes
  app.post('/api/mdm/types/:mdmId/versions', versionController.create.bind(versionController));
  app.get('/api/mdm/types/:mdmId/versions', versionController.getVersionsByType.bind(versionController));
  app.get('/api/mdm/types/:mdmId/versions/:version', versionController.findByVersion.bind(versionController));
  app.get('/api/mdm/types/:mdmId/versions/tag/:tag', versionController.findByTag.bind(versionController));
  app.post('/api/mdm/versions/:versionId/tags', versionController.addTag.bind(versionController));
  app.delete('/api/mdm/versions/:versionId/tags/:tag', versionController.removeTag.bind(versionController));

  // Record Management Routes
  app.post('/api/mdm/records', recordController.create.bind(recordController));
  app.get('/api/mdm/versions/:versionId/records', recordController.findByVersion.bind(recordController));
  app.get('/api/mdm/records/:id', recordController.findById.bind(recordController));
  app.put('/api/mdm/records/:id', recordController.update.bind(recordController));
  app.delete('/api/mdm/records/:id', recordController.delete.bind(recordController));
  app.get('/api/mdm/versions/:versionId/records/search', recordController.search.bind(recordController));

  // Excel Upload Route
  const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.UPLOAD_DIR || 'uploads');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })});
  app.post('/api/mdm/types/:mdmId/upload', upload.single('file'), new ExcelUploadController().upload.bind(new ExcelUploadController()));
};