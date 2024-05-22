import { ethers } from 'ethers';
import { from } from 'rxjs';
import { Player } from '../models/playerModel';
import { switchMap } from 'rxjs/operators';

import { getCachedData, setCachedData } from '../services/cacheService';

const provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const contractAddress = process.env.CONTRACT_ADDRESS!;
const abi = [
  "function addPlayer(address _playerAddress, uint _score) public",
  "function getPlayers() public view returns (tuple(address playerAddress, uint score)[])"
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

export const getPlayers = () => {
    return getCachedData('players').pipe(
      switchMap((cachedPlayers: string | null) => {
        if (cachedPlayers) {
          return JSON.parse(cachedPlayers);
        } else {
          return from(contract.getPlayers()).pipe(
            switchMap((players: any) => {
              const playerList = players.map((player: any) => ({
                playerAddress: player.playerAddress,
                score: player.score
              }));
              return setCachedData('players', JSON.stringify(playerList), 3600).pipe(
                switchMap(() => playerList)
              );
            })
          );
        }
      })
    );
  };

export const addPlayer = (playerAddress: string, score: number) => {
  return from(contract.addPlayer(playerAddress, score).then((tx: any) => tx.wait())).pipe(
    switchMap((tx: any) => {
      const newPlayer = { playerAddress, score, transactionHash: tx.transactionHash };
      return Player.create(newPlayer);
    })
  );
};
