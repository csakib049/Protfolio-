import { Router } from 'express';
import auth from '../middleware/auth.js';
import * as ctrl from '../controllers/skillController.js';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

export default router;
