import {Router} from 'express';
import QrCodeController from './controllers/QrCodeController';
const routes = Router();

routes.get('/qr-code', QrCodeController.index);

export default routes;