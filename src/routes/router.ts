import { Router } from 'express';
import imageController from '../controllers/image-controller';
import shopifyController from '../controllers/shopify-controller';

const router: Router = Router();

router.get('/preview', imageController.preview);
router.get('/shopify-test', shopifyController.test);
router.get('/shopify-test/variants', shopifyController.variantPersonalization);

export default router;