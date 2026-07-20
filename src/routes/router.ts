import { Router } from 'express';
import imageController from '../controllers/image-controller';

const router: Router = Router();

router.get('/preview', imageController.preview);

export default router;