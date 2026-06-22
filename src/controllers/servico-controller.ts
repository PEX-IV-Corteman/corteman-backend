import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import type { CreateServicoRequest } from "../interfaces/dtos/servico.js";

export class ServicoController {
    constructor(private readonly servicoService: ServicoService) {}

    create: RequestHandler = async (req, res) => {
        const servicoData: CreateServicoRequest = req.body;
        try {
            const servicoCreated = await this.servicoService.create(servicoData);
            return res.status(200).json({ message: "Novo serviço adicionado.", servicoCreated });
        } catch (e) {
            console.error("Erro durante a criação do serviço.");
            return res.status(500).json({ message: "Erro ao criar servico, por favor tente novamente."});
        }
    }
}
