import express from 'express';
import helmet from 'helmet';
import { config } from './config';
import { AuthController } from './controllers/AuthController';
const app: express.Application = express();

app.use(helmet());
app.use('/auth', new AuthController(config).route(express.Router()));
app.use((req, res, next) => res.status(404).end());
app.listen(config.port, () => console.log(`Listening on ${config.port}...`));
