import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/settingsController.js';

const router = Router();

router.get('/', ctrl.get);
router.put('/', auth, ctrl.update);
router.post('/resume', auth, upload.single('resume'), ctrl.uploadResume);

export default router;
