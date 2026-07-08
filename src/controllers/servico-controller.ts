import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import type { CreateServicoRequest, DeleteServicoRequest, GetServicoRequest, UpdateServicoRequest } from "../interfaces/dtos/servico.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import { isServicoValid } from "../tools/servico-validation.js";
import type { Prisma } from "../../generated/prisma/client.js";
import type { servicosModel } from "../../generated/prisma/models.js";

export class ServicoController {
    constructor(private readonly servicoService: ServicoService) { }

    create: RequestHandler = async (req, res) => {
        const servicoData: CreateServicoRequest = req.body;

        if (!isServicoValid(servicoData)) {
            return res.status(400).json({ message: "Inputs inválidos. Por favor, preencher os campos corretamente." });
        }

        try {
            const servicoCreated = await this.servicoService.create(servicoData);

            if (!servicoCreated) throw new AppError("Erro interno ao adicionar servico. Por favor, tente novamente em alguns instantes.", ErrorCodes.UnknownInternalError);

            return res.status(200).json({ message: "Novo serviço adicionado.", servicoCreated });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.errorCode = ErrorCodes.RegisterAlreadyExists) {
                    return res.status(409).json({ message: e.message });
                }
                return res.status(500).json({ message: e.message });
            }
            return res.status(500).json({ message: "Erro interno inesperado. Por favor, aguarde alguns intantes e tente novamente." });
        }
    }

    get: RequestHandler = async (req, res) => {

        const servicoId: string = req.params.id as string ?? null;
        let servico: servicosModel | servicosModel[] | null;

        try {
            if (!servicoId) {
                servico = await this.servicoService.get();
                return res.status(200).json({ servico });
            }
            servico = await this.servicoService.get(servicoId);

            if (!servico) return res.status(404).json({message: "Serviço(s) não encontrado(s)."});

            return res.status(200).json({ servico });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.errorCode === ErrorCodes.InvalidInputData) {
                    return res.status(400).json({ message: `${e.message} Por favor, tente novamente.` });
                }
            }
            return res.status(500).json({ message: "Erro ao procurar por servico. Por favor, tente novamente." });
        }
    }

    update: RequestHandler = async (req, res) => {
        
        const servicoId: string = String(req.params.id);
        const servicoData: UpdateServicoRequest = req.body;
        let nome_servico: string | null = null;
        let valor_servico: Prisma.Decimal | null = null;
        let fieldsToUpdate = { }

        try {

            if (servicoData) {
                nome_servico = servicoData.nome_servico ?? null;
                valor_servico = servicoData.valor_servico ?? null;
            }

            if (!nome_servico && !valor_servico) return res.status(400).json({ message: "Inputs inválidos. Os campos 'nome' e 'valor' precisam ser preenchidos corretamente!" });

            if (nome_servico) {
                fieldsToUpdate = {
                    nome_servico: nome_servico
                }
                if (valor_servico) {
                    fieldsToUpdate = {
                        nome_servico: nome_servico,
                        valor_servico: valor_servico
                    }
                }
            }

            await this.servicoService.update(servicoId, fieldsToUpdate);
            return res.status(200).json({ message: "Servico atualizado com sucesso." });

        } catch (e) {
            if (e instanceof AppError) {
                if (e.errorCode === ErrorCodes.InvalidInputData) {
                    return res.status(400).json({ message: e.message });
                }
                if (e.errorCode === ErrorCodes.RegisterAlreadyExists) {
                    return res.status(409).json({ message: e.message });
                }
                if (e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                    return res.status(404).json({ message: "Serviço não encontrado."});
                }
            }
            return res.status(500).json({ message: "Erro interno. Por favor, tente novamente em alguns instantes."});
        }
    }

    delete: RequestHandler = async (req, res) => {
        
        const servicoId = String(req.params.id) ?? undefined;
        
        try {
            
            if (!servicoId) {
                return res.status(400).json({ message: "Dados insuficientes. Por favor, preencher os campos necessários para identificação do serviço desejado." });
            }

            await this.servicoService.delete(servicoId);
            return res.status(204).json();

        } catch (e) {

            if (e instanceof AppError) {
                if (e.errorCode === ErrorCodes.InvalidInputData) {
                    return res.status(400).json({ message: "Dados do serviço incorretos."});
                }
                if (e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                    return res.status(404).json({ message: "Serviço não encontrado."});
                }
            }
            return res.status(500).json({ message: "Erro ao deletear serviço. Por favor, tente novamente."});

        }

    }
}
