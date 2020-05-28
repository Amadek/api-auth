import express, { Application } from 'express';
import helmet from 'helmet';
import Axios, { AxiosInstance } from 'axios';
import { config } from './config';
import { AuthController } from './controllers/AuthController';

const app: Application = express();
const axios: AxiosInstance = Axios.create();

app.use(helmet());
app.use('/auth', new AuthController(axios, config).route());
app.use((_req, res) => res.status(404).end());
app.listen(config.port, () => console.log(`Listening on ${config.port}...`));
