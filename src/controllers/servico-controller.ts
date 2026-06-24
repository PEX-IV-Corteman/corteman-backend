import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import type { CreateServicoRequest, GetServicoRequest, GetServicoResponse } from "../interfaces/dtos/servico.js";

export class ServicoController {
    constructor(private readonly servicoService: ServicoService) {}

    create: RequestHandler = async (req, res) => {
        const servicoData: CreateServicoRequest = req.body;
        try {
            const servicoCreated = await this.servicoService.create(servicoData);
            return res.status(200).json({ message: "Novo serviço adicionado.", servicoCreated });
        } catch (e) {
            console.error("Erro durante a criação do serviço.");
            return res.status(500).json({ message: "Erro ao criar servico. Por favor, tente novamente."});
        }
    }

    get: RequestHandler = async (req, res) => {
        const servicoData: GetServicoRequest = req.body;
        const servidoId: string = String(req.params.id);
        const { nome_servico: nomeServico } = servicoData;
        try {
            const servico = await this.servicoService.get(servidoId, nomeServico);
            return res.status(200).json({ servico });
        } catch (e) {
            console.error("Erro ao procurar servico:", e);
            return res.status(500).json({ message: "Erro ao procurar por servico. Por favor, tente novamente."});
        }
    }
}
