import './config';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { playerRoutes } from './routes/playerRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api', playerRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL!, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
