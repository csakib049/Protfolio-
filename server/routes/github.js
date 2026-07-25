import { Router } from 'express';
import { getGitHubData } from '../controllers/githubController.js';

const router = Router();

router.get('/', getGitHubData);

export default router;
