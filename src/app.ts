import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { playerRoutes } from './routes/playerRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api', playerRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URL!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
