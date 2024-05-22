import { ethers } from 'ethers';
import { from } from 'rxjs';
import { Player } from '../models/playerModel';

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
    contract.getPlayers().then((players: any) => {
      const playerList = players[0].map((address: string, index: number) => ({
        playerAddress: address,
        score: players[1][index].toNumber()
      }));
      return playerList;
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
