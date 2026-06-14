import { Router } from 'express';
import auth from '../middleware/auth.js';
import * as ctrl from '../controllers/messageController.js';

const router = Router();

router.get('/', auth, ctrl.getAll);
router.post('/', ctrl.create);
router.patch('/:id/read', auth, ctrl.markRead);
router.delete('/:id', auth, ctrl.remove);

export default router;
