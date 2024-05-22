import { Request, Response } from 'express';
import { getPlayers as getPlayersService, addPlayer as addPlayerService } from '../services/blockchainService';
import { kafkaProducerStream } from '../services/kafkaService';
import { of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

export const getPlayers = (req: Request, res: Response) => {
  getPlayersService().pipe(
    switchMap(players => of(res.json(players))),
    catchError(err => {
      res.status(500).json({ error: err.message });
      return of(null);
    })
  ).subscribe();
};

export const createPlayer = (req: Request, res: Response) => {
  const { playerAddress, score } = req.body;
  addPlayerService(playerAddress, score).pipe(
    tap(() => {
      kafkaProducerStream.next({ playerAddress, score });
    }),
    switchMap(tx => of(res.status(201).json({ transactionHash: tx.transactionHash }))),
    catchError(err => {
      res.status(500).json({ error: err.message });
      return of(null);
    })
  ).subscribe();
};
