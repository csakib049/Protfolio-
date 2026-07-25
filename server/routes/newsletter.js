import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/newsletterController.js';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', auth, upload.array('images', 4), ctrl.create);
router.put('/:id', auth, upload.array('images', 4), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

export default router;
