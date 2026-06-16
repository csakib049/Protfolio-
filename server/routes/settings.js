import { Router } from 'express';
import auth from '../middleware/auth.js';
import * as ctrl from '../controllers/settingsController.js';

const router = Router();

router.get('/', ctrl.get);
router.put('/', auth, ctrl.update);

export default router;
