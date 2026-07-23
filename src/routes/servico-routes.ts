import express from "express";
import { ServicoService } from "../services/servico-service.js";
import { ServicoController } from "../controllers/servico-controller.js";
import { PrismaServicoRepository } from "../repositories/prisma-servico-repository.js";

const repository = new PrismaServicoRepository();
const service = new ServicoService(repository);
const controller = new ServicoController(service);
const servicoRouter = express.Router();

servicoRouter.post("/servicos", controller.create);
servicoRouter.get("/servicos/:id", controller.get);
servicoRouter.get("/servicos", controller.get);
servicoRouter.get("/servicos-filter", controller.filter);
servicoRouter.put("/servicos/:id", controller.update);
servicoRouter.delete("/servicos/:id", controller.delete);

export { servicoRouter };
