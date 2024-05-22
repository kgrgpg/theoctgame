import { fetchPlayers, createPlayer } from '../src/controllers/playerController';
import { getPlayers, addPlayer } from '../src/services/blockchainService';
import { Request, Response } from 'express';
import { of, throwError } from 'rxjs';

jest.mock('../src/services/blockchainService');

describe('Player Controller', () => {
  it('should fetch players', (done) => {
    const req = {} as Request;
    const res = {} as Response;
    res.json = jest.fn();

    (getPlayers as jest.Mock).mockReturnValue(of([{ playerAddress: '0x123', score: 100 }]));

    fetchPlayers(req, res, jest.fn());

    setImmediate(() => {
      expect(res.json).toHaveBeenCalledWith([{ playerAddress: '0x123', score: 100 }]);
      done();
    });
  });

  it('should handle fetch players error', (done) => {
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn();

    (getPlayers as jest.Mock).mockReturnValue(throwError(new Error('Error fetching players')));

    fetchPlayers(req, res, jest.fn());

    setImmediate(() => {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching players');
      done();
    });
  });

  it('should add a player', (done) => {
    const req = { body: { playerAddress: '0x123', score: 100 } } as Request;
    const res = {} as Response;
    res.json = jest.fn();

    (addPlayer as jest.Mock).mockReturnValue(of({}));

    createPlayer(req, res, jest.fn());

    setImmediate(() => {
      expect(res.json).toHaveBeenCalled();
      done();
    });
  });

  it('should handle add player error', (done) => {
    const req = { body: { playerAddress: '0x123', score: 100 } } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn();

    (addPlayer as jest.Mock).mockReturnValue(throwError(new Error('Error adding player')));

    createPlayer(req, res, jest.fn());

    setImmediate(() => {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error adding player');
      done();
    });
  });
});
