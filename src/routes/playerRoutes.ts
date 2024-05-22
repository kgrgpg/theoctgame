import { Router } from 'express';
import { getPlayers, createPlayer } from '../controllers/playerController';
import { validatePlayer } from '../middleware/validationMiddleware';

const router = Router();

router.get('/players', getPlayers);
router.post('/players', validatePlayer, createPlayer);

export { router as playerRoutes };
