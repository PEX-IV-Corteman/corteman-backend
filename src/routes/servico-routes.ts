import express from "express";
import { ServicoService } from "../services/servico-service.js";
import { ServicoController } from "../controllers/servico-controller.js";

const service = new ServicoService();
const controller = new ServicoController(service);
const servicoRouter = express.Router();

servicoRouter.post("/servicos", controller.create);
servicoRouter.get("/servicos/:id", controller.get);
servicoRouter.get("/servicos/", controller.get);

export { servicoRouter };
