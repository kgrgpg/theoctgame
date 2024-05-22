import { ethers } from 'ethers';
import { from, of, Observable } from 'rxjs';
import { Player } from '../models/playerModel';
import { switchMap, map, catchError } from 'rxjs/operators';
import { getCachedData, setCachedData } from '../services/cacheService';

// Import specific classes from ethers
const { JsonRpcProvider, Wallet, Contract } = ethers;

const provider = new JsonRpcProvider(process.env.RINKEBY_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
const contractAddress = process.env.CONTRACT_ADDRESS!;
const abi = [
  "function addPlayer(address _playerAddress, uint _score) public",
  "function getPlayers() public view returns (tuple(address playerAddress, uint score)[])"
];

const contract = new Contract(contractAddress, abi, wallet);

export const getPlayers = (): Observable<{ playerAddress: string, score: number }[]> => {
  return getCachedData('players').pipe(
    switchMap((cachedPlayers: string | null) => {
      if (cachedPlayers) {
        const players = JSON.parse(cachedPlayers) as { playerAddress: string; score: number }[];
        return of(players);
      } else {
        return from(contract.getPlayers()).pipe(
          switchMap((players: any) => {
            const playerList = players.map((player: any) => ({
              playerAddress: player.playerAddress,
              score: player.score
            }));
            return setCachedData('players', JSON.stringify(playerList), 3600).pipe(
              map(() => playerList)
            );
          }),
          catchError(err => {
            console.error('Error fetching players from contract:', err);
            return of([]);
          })
        );
      }
    })
  );
};

export const addPlayer = (playerAddress: string, score: number): Observable<any> => {
  return from(contract.addPlayer(playerAddress, score).then((tx: any) => tx.wait())).pipe(
    switchMap((tx: any) => {
      const newPlayer = { playerAddress, score, transactionHash: tx.transactionHash };
      return Player.create(newPlayer);
    }),
    catchError(err => {
      console.error('Error adding player to contract:', err);
      throw err;
    })
  );
};
