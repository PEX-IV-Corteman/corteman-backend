import express from "express"
import { PrismaRetiradaRepository } from "../repositories/prisma-retirada-repository.js";
import { RetiradaService } from "../services/retirada-service.js";
import { RetiradaController } from "../controllers/retirada-controller.js";

const retiradaRouter = express.Router();
const repository = new PrismaRetiradaRepository();
const service = new RetiradaService(repository);
const controller = new RetiradaController(service);

retiradaRouter.post("/retiradas", controller.create);
retiradaRouter.get("/retiradas", controller.list);
retiradaRouter.get("/retiradas/:id", controller.find);
retiradaRouter.put("retiradas/:id", controller.update);
retiradaRouter.delete("retiradas/:id", controller.delete);

export { retiradaRouter };
