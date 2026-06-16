import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/achievementController.js';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', auth, upload.single('image'), ctrl.create);
router.put('/:id', auth, upload.single('image'), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

export default router;
