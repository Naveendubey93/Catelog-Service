import config from 'config';
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import globalErrorHandler from './common/middlewares/globalErrorHandler';
import categoryRouter from './category/category-router';
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
// app.options('*', cors()); // Preflight support

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.get('/', async (req: Request, res: Response) => {
  res.status(201).send(`Welcome to Catelog application on port ${config.get('server.port')}`);
});

app.get('/health', async (req: Request, res: Response) => {
  res.status(200).send('OK');
});
app.use('/categories', categoryRouter);

app.use(globalErrorHandler);

export default app;
