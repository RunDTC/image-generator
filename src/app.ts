import express, { Express } from 'express';
import imageRoutes from './routes/router';

const app: Express = express();

app.use(express.json());

app.use('/', imageRoutes);

export default app;