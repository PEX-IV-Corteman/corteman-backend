import express from "express";
import { PrismaAtendimentoRepository } from "../repositories/prisma-atendimento-repository.js";
import { AtendimentoService } from "../services/atendimento-service.js";
import { AtendimentoController } from "../controllers/atendimento-controller.js";

const atendimentoRouter = express.Router();
const repository = new PrismaAtendimentoRepository();
const service = new AtendimentoService(repository);
const controller = new AtendimentoController(service);

atendimentoRouter.post("/atendimentos", controller.create);
atendimentoRouter.get("/atendimentos", controller.list);
atendimentoRouter.get("/atendimentos/:id", controller.find);
atendimentoRouter.put("/atendimentos/:id", controller.update);
atendimentoRouter.delete("/atendimentos/:id", controller.delete);

export { atendimentoRouter };
