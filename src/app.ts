import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routers from "./routes";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({type: "application/vnd.api+json"}));
app.use(cors());
app.use(helmet());
app.use(compression());

app.use('/', routers.router);

export {app};
