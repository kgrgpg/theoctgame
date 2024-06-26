import { Request, Response, NextFunction } from 'express';
import { getPlayers as getPlayersService, addPlayer as addPlayerService } from '../services/blockchainService';
import { kafkaProducerStream } from '../services/kafkaService';
import { of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

export const getPlayers = (req: Request, res: Response, next: NextFunction) => {
  getPlayersService().pipe(
    switchMap(players => of(res.json(players))),
    catchError(err => {
      console.error('Error in getPlayers:', err);
      res.status(500).json({ error: err.message });
      return of(null);
    })
  ).subscribe();
};

export const createPlayer = (req: Request, res: Response, next: NextFunction) => {
  const { playerAddress, score } = req.body;
  addPlayerService(playerAddress, score).pipe(
    tap(() => {
      const message = {
        topic: 'player-updates',
        key: playerAddress,
        value: JSON.stringify({ playerAddress, score })
      };
      kafkaProducerStream.next(message);
    }),
    switchMap(tx => of(res.status(201).json({ transactionHash: tx.transactionHash }))),
    catchError(err => {
      console.error('Error in createPlayer:', err);
      res.status(500).json({ error: err.message });
      return of(null);
    })
  ).subscribe();
};
