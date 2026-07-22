import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/profileController.js';

const router = Router();

router.get('/', ctrl.getProfile);
router.put('/', auth, ctrl.updateBio);
router.post('/photo', auth, upload.single('photo'), ctrl.uploadPhoto);

export default router;
