import { Router } from 'express';
import { login, signup, seedAdmin } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.all('/seed', seedAdmin);

export default router;
