import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/skillController.js';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', auth, upload.single('logo'), ctrl.create);
router.put('/:id', auth, upload.single('logo'), ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.get('/sync-logos', ctrl.syncLogos);

export default router;
