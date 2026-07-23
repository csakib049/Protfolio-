import { Router } from 'express';
import { login, seedAdmin } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.all('/seed', seedAdmin);

export default router;
