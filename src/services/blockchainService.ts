import { ethers } from 'ethers';
import { from } from 'rxjs';
import { Player } from '../models/playerModel';

import { getAsync, setAsync } from '../services/cacheService';

const provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;

const contractABI = [
  "function addPlayer(address _playerAddress, uint _score) public",
  "function getPlayers() public view returns (address[] memory, uint[] memory)"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export const getPlayers = () => {
    return from(
      getAsync('players').then(async (cachedPlayers) => {
        if (cachedPlayers) {
          return JSON.parse(cachedPlayers);
        } else {
          const players = await contract.getPlayers();
          const playerList = players[0].map((address: string, index: number) => ({
            playerAddress: address,
            score: players[1][index].toNumber()
          }));
          await setAsync('players', JSON.stringify(playerList), 'EX', 3600); // cache for 1 hour
          return playerList;
        }
      })
    );
  };

export const addPlayer = (playerAddress: string, score: number) => {
  return from(
    contract.addPlayer(playerAddress, score).then(async (tx: any) => {
      await tx.wait();
      const newPlayer = new Player({ playerAddress, score, transactionHash: tx.hash });
      await newPlayer.save();
      return tx;
    })
  );
};
