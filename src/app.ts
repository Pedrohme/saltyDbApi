import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import apiIndexRouter = require('./routes/api/index');
import apiFighterRouter = require('./routes/api/fighter');
import apiFightsRouter = require('./routes/api/fights');
import apiLoginRouter = require('./routes/api/login');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({type: "application/vnd.api+json"}));
app.use(cors());
app.use(helmet());
app.use(compression());

app.use('/api', apiIndexRouter.router);
app.use('/api', apiFighterRouter.router);
app.use('/api', apiFightsRouter.router);
app.use('/api', apiLoginRouter.router);

export {app};
