import type { Express } from "express";
import { servicoRouter } from "./servico-routes.js";
import { atendimentoRouter } from "./atendimento-routes.js";

const routes = (app: Express) => {
    app.use(servicoRouter);
    app.use(atendimentoRouter);
}

export { routes };
