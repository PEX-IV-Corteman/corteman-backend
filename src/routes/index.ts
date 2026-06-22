import type { Express } from "express";
import { servicoRouter } from "./servico-routes.js";

const routes = (app: Express) => {
    app.use(servicoRouter);
}

export { routes };