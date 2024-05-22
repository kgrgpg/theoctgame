import { Router } from 'express';
import { getPlayers, createPlayer } from '../controllers/playerController';
import { validatePlayer } from '../middleware/validationMiddleware';

const router = Router();

router.get('/players', (req, res, next) => {
  console.log('GET /players called');
  getPlayers(req, res, next).catch(next);
});

router.post('/players', validatePlayer, (req, res, next) => {
  console.log('POST /players called');
  createPlayer(req, res, next).catch(next);
});

export { router as playerRoutes };
