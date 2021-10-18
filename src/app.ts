import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routers from "./routes";
import path from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", path.resolve("./dist/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({type: "application/vnd.api+json"}));
app.use(cors());
app.use(helmet());
app.use(compression());


app.use('/', routers.router);

app.get('*', (req, res) => {
    res.status(404);
    res.render("error");
})

export {app};
