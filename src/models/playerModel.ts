import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  playerAddress: { type: String, required: true },
  score: { type: Number, required: true },
  transactionHash: { type: String, required: true }
});

export const Player = mongoose.model('Player', playerSchema);
