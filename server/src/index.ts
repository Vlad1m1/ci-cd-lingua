import express from 'express';
import logger from './utils/logger';
import config from './config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {errorHandlingMiddleware} from "./middleware/errorHandling.middleware";
import {setupStaticMiddleware} from "./middleware/static.middleware";
import {corsConfig} from "./config/corsConfig";
import routes from "./routes";
import {sequelize} from './models';
import path from "path";
import {swaggerConfig} from "./config/swaggerConfig";
import * as http from "node:http";

export const ROOT_PATH = path.resolve(__dirname, '..');

const app = express();
export const server = http.createServer(app);

const port = config.port || 8000;
const host = config.host || 'localhost';
const isDev = config.env === 'development';

app.use(express.json());
app.use(cors(corsConfig(isDev)));
app.use(cookieParser());

app.use('/api', routes);

if(isDev) {
	app.use("/api/docs", ...swaggerConfig());
}

setupStaticMiddleware(app);

app.use(errorHandlingMiddleware);

const start = async () => {
	await sequelize.authenticate();
	await sequelize.sync();
	
	server.listen(port, host, () => {
		logger.info(`Сервер запущен на http://${host}:${port} [${config.env}]`);
	});
	
	if(isDev) {
		logger.info(`Документация Swagger http://${host}:${port}/api/docs`);
	}
}

start()
