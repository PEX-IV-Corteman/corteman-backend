import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import type { CreateServicoRequest, GetServicoRequest, GetServicoResponse } from "../interfaces/dtos/servico.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import { isServicoQueryValid, isServicoValid } from "../tools/servico-validation.js";

export class ServicoController {
    constructor(private readonly servicoService: ServicoService) {}

    create: RequestHandler = async (req, res) => {
        let statusCode: number = 500;
        let responseMessage: string = "Erro interno do servidor. Por favor, tente novamente.";
        const servicoData: CreateServicoRequest = req.body;

        if(!isServicoValid(servicoData)) {
            return res.status(400).json({message: "Inputs inválidos. Por favor, preencher os campos corretamente."});
        }

        try {
            const servicoCreated = await this.servicoService.create(servicoData);
            return res.status(200).json({ message: "Novo serviço adicionado.", servicoCreated });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.errorCode = ErrorCodes.RegisterAlreadyExists) {
                    statusCode = 400;
                    responseMessage = e.message;
                }
            }
            return res.status(statusCode).json({ message: responseMessage});
        }
    }

    get: RequestHandler = async (req, res) => {
        const servicoData: GetServicoRequest = req.body;
        const servidoId: string = req.params.id as string;
        let nomeServico = servicoData ? servicoData.nome_servico : undefined;
        
        if (!isServicoQueryValid(servicoData)) {
            return res.status(400).json({ message: "Input inválido. Por favor, preencha o campo corretamente."})
        }
        
        try {
            const servico = await this.servicoService.get(servidoId, nomeServico);
            if (!servico) return res.status(404).json({ message: "Servico não encontado."});
            return res.status(200).json({ servico });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.errorCode === ErrorCodes.InvalidInputData) {
                    return res.status(400).json({ message: `${e.message} Por favor, tente novamente.`});
                }
            }
            return res.status(500).json({ message: "Erro ao procurar por servico. Por favor, tente novamente."});
        }
    }
}
