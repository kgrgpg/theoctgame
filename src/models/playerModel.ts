import mongoose from 'mongoose';
import { from } from 'rxjs';

const playerSchema = new mongoose.Schema({
  playerAddress: { type: String, required: true },
  score: { type: Number, required: true },
  transactionHash: { type: String, required: true }
});

const PlayerModel = mongoose.model('Player', playerSchema);

export const Player = {
  create: (data: any) => from(new PlayerModel(data).save()),
  findAll: () => from(PlayerModel.find().exec())
};
